import { Chess } from "chess.js";
import type { EngineEval } from "@/lib/engine/uci";

export type MoveClass = "best" | "excellent" | "good" | "inaccuracy" | "mistake" | "blunder";

export const CLASS_LABELS: Record<MoveClass, string> = {
  best: "Meilleur coup",
  excellent: "Excellent",
  good: "Bon coup",
  inaccuracy: "Imprécision",
  mistake: "Erreur",
  blunder: "Gaffe"
};

/** Seuils (perte de probabilité de gain, en points de %), inspirés de Lichess. */
export const THRESHOLDS = { excellent: 2, inaccuracy: 10, mistake: 20, blunder: 30 };

/** Probabilité de gain (0-100) du point de vue des Blancs à partir des centipions. */
export function winPercent(cp: number) {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

/** Précision d'un coup (0-100) à partir de la perte de probabilité de gain. */
export function moveAccuracy(winLoss: number) {
  const value = 103.1668 * Math.exp(-0.04354 * Math.max(0, winLoss)) - 3.1669 + 1;
  return Math.min(100, Math.max(0, value));
}

export function classifyLoss(winLoss: number, playedBest: boolean): MoveClass {
  if (playedBest) return "best";
  if (winLoss >= THRESHOLDS.blunder) return "blunder";
  if (winLoss >= THRESHOLDS.mistake) return "mistake";
  if (winLoss >= THRESHOLDS.inaccuracy) return "inaccuracy";
  if (winLoss <= THRESHOLDS.excellent) return "excellent";
  return "good";
}

export type AnalyzedMove = {
  ply: number;
  color: "w" | "b";
  san: string;
  uci: string;
  fenBefore: string;
  bestSan: string;
  winLoss: number;
  accuracy: number;
  cpAfter: number;
  mateAfter: number | null;
  classification: MoveClass;
};

export type KeyMoment = AnalyzedMove & { why: string; better: string; lesson: string };

export type SideSummary = {
  accuracy: number;
  counts: Record<MoveClass, number>;
};

export type GameReport = {
  engine: true;
  moves: AnalyzedMove[];
  white: SideSummary;
  black: SideSummary;
  keyMoments: KeyMoment[];
};

const emptyCounts = (): Record<MoveClass, number> => ({ best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 });

function uciToSan(fen: string, uci: string) {
  if (!uci) return "";
  try {
    const chess = new Chess(fen);
    return chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] })?.san ?? uci;
  } catch {
    return uci;
  }
}

/** Texte pédagogique basé uniquement sur des faits mesurés (pas de texte générique). */
function explain(move: AnalyzedMove, before: EngineEval, bestSan: string) {
  const mover = move.color === "w" ? 1 : -1;
  const sign = (cp: number) => (cp * mover > 0 ? "avantage" : "désavantage");
  const facts: string[] = [];
  const mateBefore = before.mate !== null && Math.sign(before.mate) === mover;
  const mateAfter = move.mateAfter !== null && Math.sign(move.mateAfter) === mover;
  const allowedMate = move.mateAfter !== null && Math.sign(move.mateAfter) === -mover;
  if (mateBefore && !mateAfter) facts.push("Vous aviez un mat forcé et il a été laissé passer.");
  else if (allowedMate) facts.push("Ce coup permet à l'adversaire de forcer un mat.");
  else {
    const swing = (before.cp - move.cpAfter) * mover;
    facts.push(
      `L'évaluation passe de ${(before.cp / 100 * mover).toFixed(1)} à ${(move.cpAfter / 100 * mover).toFixed(1)} pour votre camp (perte d'environ ${(swing / 100).toFixed(1)} pion), soit un ${sign(move.cpAfter)} ${Math.abs(move.cpAfter) < 100 ? "léger" : "net"}.`
    );
  }
  const captured = (() => {
    try {
      const chess = new Chess(move.fenBefore);
      const best = chess.move({ from: before.best.slice(0, 2), to: before.best.slice(2, 4), promotion: before.best[4] });
      return best?.captured ? best : null;
    } catch {
      return null;
    }
  })();
  if (captured && !move.san.includes("x")) facts.push(`Une capture était disponible (${bestSan}).`);
  if (move.san.includes("+") ) facts.push("Un échec n'est pas toujours le meilleur coup : vérifiez ce que l'adversaire peut répondre.");
  return {
    why: facts.join(" "),
    better: bestSan ? `Le moteur préférait ${bestSan}.` : "Pas d'alternative évidente.",
    lesson:
      move.classification === "blunder"
        ? "Avant de jouer, listez les menaces de l'adversaire (échecs, captures, attaques) sur la case d'arrivée."
        : move.classification === "mistake"
          ? "Comparez au moins deux coups candidats et vérifiez la sécurité de vos pièces."
          : "Une petite imprécision : cherchez le coup qui améliore votre pièce la moins active."
  };
}

/**
 * Construit le rapport à partir des évaluations de chaque position.
 * `evals[i]` est l'évaluation de la position avant le coup i+1 ; `evals[n]` celle de la position finale.
 */
export function buildReport(pgn: string, evals: EngineEval[]): GameReport | null {
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
  } catch {
    return null;
  }
  const history = chess.history({ verbose: true });
  if (history.length === 0 || evals.length !== history.length + 1) return null;

  const moves: AnalyzedMove[] = history.map((move, index) => {
    const before = evals[index];
    const after = evals[index + 1];
    const uci = `${move.from}${move.to}${move.promotion ?? ""}`;
    const mover = move.color === "w" ? 1 : -1;
    const winLoss = Math.max(0, (winPercent(before.cp) - winPercent(after.cp)) * mover);
    const playedBest = uci === before.best;
    return {
      ply: index + 1,
      color: move.color,
      san: move.san,
      uci,
      fenBefore: move.before,
      bestSan: playedBest ? move.san : uciToSan(move.before, before.best),
      winLoss,
      accuracy: moveAccuracy(winLoss),
      cpAfter: after.cp,
      mateAfter: after.mate,
      classification: classifyLoss(winLoss, playedBest)
    };
  });

  const summarize = (color: "w" | "b"): SideSummary => {
    const own = moves.filter((move) => move.color === color);
    const counts = emptyCounts();
    own.forEach((move) => counts[move.classification]++);
    const accuracy = own.length ? own.reduce((sum, move) => sum + move.accuracy, 0) / own.length : 0;
    return { accuracy: Math.round(accuracy * 10) / 10, counts };
  };

  const keyMoments: KeyMoment[] = moves
    .filter((move) => move.winLoss >= THRESHOLDS.inaccuracy)
    .sort((a, b) => b.winLoss - a.winLoss)
    .slice(0, 5)
    .sort((a, b) => a.ply - b.ply)
    .map((move) => ({ ...move, ...explain(move, evals[move.ply - 1], move.bestSan) }));

  return { engine: true, moves, white: summarize("w"), black: summarize("b"), keyMoments };
}
