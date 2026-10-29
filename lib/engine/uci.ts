/** Client UCI pour Stockfish (WASM) exécuté dans un Web Worker : l'interface ne gèle jamais. */

export type EngineEval = {
  /** Centipions du point de vue des Blancs. */
  cp: number;
  /** Mat en N coups (positif = les Blancs matent), null si pas de mat vu. */
  mate: number | null;
  /** Meilleur coup au format UCI (ex. "e2e4"), vide si la partie est terminée. */
  best: string;
};

export type Level = "easy" | "medium" | "hard";

const LEVELS: Record<Level, { skill: number; movetime: number }> = {
  easy: { skill: 1, movetime: 80 },
  medium: { skill: 9, movetime: 250 },
  hard: { skill: 18, movetime: 700 }
};

export const ENGINE_URL = "/stockfish/stockfish-nnue-16-single.js";

export class StockfishEngine {
  private worker: Worker | null = null;
  private listeners = new Set<(line: string) => void>();
  private chain: Promise<unknown> = Promise.resolve();
  private readyPromise: Promise<void> | null = null;

  constructor(private url: string = ENGINE_URL) {}

  /** Démarre le worker et attend le handshake UCI. Rejette après 10 s (l'appelant doit prévoir un repli). */
  init(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;
    this.readyPromise = new Promise<void>((resolve, reject) => {
      try {
        this.worker = new Worker(this.url);
      } catch (error) {
        reject(error);
        return;
      }
      this.worker.onmessage = (event: MessageEvent) => {
        const line = String(event.data);
        this.listeners.forEach((listener) => listener(line));
      };
      this.worker.onerror = (event) => reject(new Error(event.message || "Moteur indisponible"));
      const timer = setTimeout(() => reject(new Error("Le moteur ne répond pas")), 10000);
      this.send("uci", (line) => line === "uciok")
        .then(() => {
          this.post("setoption name Use NNUE value false");
          this.post("setoption name Threads value 1");
          return this.send("isready", (line) => line === "readyok");
        })
        .then(() => {
          clearTimeout(timer);
          resolve();
        })
        .catch(reject);
    });
    this.readyPromise.catch(() => this.terminate());
    return this.readyPromise;
  }

  private post(command: string) {
    this.worker?.postMessage(command);
  }

  /** Envoie une commande et résout à la première ligne qui satisfait `done`. */
  private send(command: string, done: (line: string) => boolean, onLine?: (line: string) => void) {
    return new Promise<string>((resolve) => {
      const listener = (line: string) => {
        onLine?.(line);
        if (done(line)) {
          this.listeners.delete(listener);
          resolve(line);
        }
      };
      this.listeners.add(listener);
      this.post(command);
    });
  }

  /** Sérialise les recherches : une seule `go` à la fois. */
  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const next = this.chain.then(task, task);
    this.chain = next.catch(() => undefined);
    return next;
  }

  /** Meilleur coup (UCI) pour un niveau de jeu donné. */
  bestMove(fen: string, level: Level): Promise<string> {
    const { skill, movetime } = LEVELS[level];
    return this.enqueue(async () => {
      await this.init();
      this.post(`setoption name Skill Level value ${skill}`);
      this.post(`position fen ${fen}`);
      const line = await this.send(`go movetime ${movetime}`, (l) => l.startsWith("bestmove"));
      const move = line.split(" ")[1];
      return move && move !== "(none)" ? move : "";
    });
  }

  /** Évalue une position à profondeur fixe (force maximale). */
  evaluate(fen: string, depth = 12): Promise<EngineEval> {
    const whiteToMove = fen.split(" ")[1] !== "b";
    return this.enqueue(async () => {
      await this.init();
      this.post("setoption name Skill Level value 20");
      this.post(`position fen ${fen}`);
      let cp = 0;
      let mate: number | null = null;
      const line = await this.send(`go depth ${depth}`, (l) => l.startsWith("bestmove"), (l) => {
        const match = l.match(/^info .*? score (cp|mate) (-?\d+)/);
        if (!match || l.includes("lowerbound") || l.includes("upperbound")) return;
        const value = Number(match[2]) * (whiteToMove ? 1 : -1);
        if (match[1] === "cp") {
          cp = value;
          mate = null;
        } else {
          mate = value;
          cp = value > 0 ? 10000 - Math.abs(value) * 10 : -10000 + Math.abs(value) * 10;
        }
      });
      const best = line.split(" ")[1];
      return { cp, mate, best: best && best !== "(none)" ? best : "" };
    });
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
    this.listeners.clear();
    this.readyPromise = null;
  }
}
