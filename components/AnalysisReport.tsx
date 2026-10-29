"use client";

import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { buildReport, CLASS_LABELS, type GameReport } from "@/lib/engine/analysis";
import { StockfishEngine, type EngineEval } from "@/lib/engine/uci";

const DEPTH = 12;

function fmtEval(cp: number, mate: number | null) {
  if (mate !== null) return `#${mate}`;
  return `${cp > 0 ? "+" : ""}${(cp / 100).toFixed(1)}`;
}

export function AnalysisReport({ initialPgn }: { initialPgn: string }) {
  const [pgn, setPgn] = useState(initialPgn);
  const [progress, setProgress] = useState<number | null>(null);
  const [report, setReport] = useState<GameReport | null>(null);
  const [error, setError] = useState("");
  const engineRef = useRef<StockfishEngine | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
      engineRef.current?.terminate();
    };
  }, []);

  async function run() {
    setError("");
    setReport(null);
    const game = new Chess();
    try {
      game.loadPgn(pgn);
    } catch {
      setError("PGN invalide.");
      return;
    }
    const history = game.history({ verbose: true });
    if (history.length === 0) {
      setError("Aucun coup à analyser.");
      return;
    }
    if (history.length > 200) {
      setError("Partie trop longue (200 demi-coups maximum).");
      return;
    }
    const fens = [history[0].before, ...history.map((move) => move.after)];
    const engine = (engineRef.current ??= new StockfishEngine());
    const evals: EngineEval[] = [];
    setProgress(0);
    try {
      for (let i = 0; i < fens.length; i++) {
        if (cancelled.current) return;
        evals.push(await engine.evaluate(fens[i], DEPTH));
        setProgress(Math.round(((i + 1) / fens.length) * 100));
      }
      const built = buildReport(pgn, evals);
      if (!built) throw new Error("Rapport impossible");
      setReport(built);
    } catch {
      engine.terminate();
      engineRef.current = null;
      setError("Le moteur d'analyse est indisponible dans ce navigateur. Réessayez ou rechargez la page.");
    } finally {
      setProgress(null);
    }
  }

  const sides = report
    ? [
        { name: "Blancs", data: report.white },
        { name: "Noirs", data: report.black }
      ]
    : [];

  return (
    <div className="grid gap-6">
      <label className="grid gap-2 text-sm font-medium">
        Partie (PGN)
        <textarea
          value={pgn}
          onChange={(event) => setPgn(event.target.value)}
          rows={4}
          maxLength={20000}
          className="rounded border p-3 font-mono text-ink"
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={run}
          disabled={progress !== null}
          className="rounded bg-ink px-4 py-3 text-white disabled:opacity-60"
        >
          {progress !== null ? `Analyse en cours… ${progress} %` : "Analyser avec Stockfish"}
        </button>
        {progress !== null && (
          <div className="h-2 w-48 overflow-hidden rounded bg-black/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-sage" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      {error && <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-red-800">{error}</p>}

      {report && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {sides.map(({ name, data }) => (
              <div key={name} className="rounded border p-4 dark:border-white/10">
                <p>Précision des {name}</p>
                <strong className="text-3xl">{data.accuracy} %</strong>
                <ul className="mt-2 grid grid-cols-2 gap-x-4 text-sm">
                  {(Object.keys(CLASS_LABELS) as (keyof typeof CLASS_LABELS)[]).map((key) => (
                    <li key={key}>
                      {CLASS_LABELS[key]} : {data.counts[key]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <section className="grid gap-3">
            <h2 className="text-xl font-semibold">Moments clés</h2>
            {report.keyMoments.length === 0 && <p>Aucune erreur marquante : belle partie.</p>}
            {report.keyMoments.map((moment) => (
              <article key={moment.ply} className="rounded border p-4 dark:border-white/10">
                <strong>
                  {Math.ceil(moment.ply / 2)}
                  {moment.color === "w" ? "." : "..."} {moment.san} — {CLASS_LABELS[moment.classification]}
                </strong>
                <p className="mt-2">{moment.why}</p>
                <p className="mt-2 text-sm text-sage">{moment.better}</p>
                <p className="mt-2 text-sm">À retenir : {moment.lesson}</p>
              </article>
            ))}
          </section>
          <section className="grid gap-2">
            <h2 className="text-xl font-semibold">Tous les coups</h2>
            <ol className="flex flex-wrap gap-2 text-sm">
              {report.moves.map((move) => (
                <li key={move.ply} className="rounded border px-2 py-1 dark:border-white/10" title={`${CLASS_LABELS[move.classification]} · éval ${fmtEval(move.cpAfter, move.mateAfter)}`}>
                  {move.ply % 2 === 1 ? `${Math.ceil(move.ply / 2)}. ` : ""}
                  {move.san}
                  {move.classification === "blunder" ? " ??" : move.classification === "mistake" ? " ?" : move.classification === "inaccuracy" ? " ?!" : ""}
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </div>
  );
}
