"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import { ChessBoard } from "@/components/ChessBoard";
import { chooseComputerMove, coachHints } from "@/lib/chess";

export function PlayComputer() {
  const [chess, setChess] = useState(() => new Chess());
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [training, setTraining] = useState(true);
  const [assist, setAssist] = useState<"light" | "guided" | "complete">("guided");
  const [message, setMessage] = useState("Mode entrainement : les conseils sont pedagogiques et reserves aux parties contre l'ordinateur.");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [history, setHistory] = useState<string[]>([]);

  function update(next: Chess) {
    setChess(new Chess(next.fen()));
    setHistory(next.history());
  }

  function onMove(_from: string, _to: string, san: string, fen: string) {
    const next = new Chess(fen);
    const computer = chooseComputerMove(next.fen(), difficulty);
    if (computer) next.move(computer.san);
    update(next);
    const hint = coachHints(next.fen());
    setMessage(training ? (assist === "light" ? hint.light : assist === "guided" ? hint.guided : `${hint.guided} Candidats : ${hint.candidates.join(", ")}`) : `Vous avez joue ${san}.`);
  }

  async function save() {
    const result = chess.isDraw() ? "DRAW" : chess.isCheckmate() ? (chess.turn() === "w" ? "BLACK_WIN" : "WHITE_WIN") : "ONGOING";
    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pgn: chess.pgn(), result, color: orientation, difficulty, trainingMode: training, moves: history.map((san, i) => ({ san, fen: chess.fen(), ply: i + 1 })) })
    });
    const data = await res.json();
    window.location.href = `/analysis?id=${data.id ?? "local"}&pgn=${encodeURIComponent(chess.pgn())}`;
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <section className="mx-auto w-full max-w-[620px]"><ChessBoard fen={chess.fen()} onMove={onMove} orientation={orientation} /></section>
      <aside className="grid content-start gap-4 rounded border border-black/10 p-5 dark:border-white/10">
        <h1 className="text-2xl font-semibold">Partie contre l&apos;ordinateur</h1>
        <label className="grid gap-1 text-sm">Difficulte<select value={difficulty} onChange={(e) => setDifficulty(e.target.value as never)} className="rounded border p-2 text-ink"><option value="easy">Facile</option><option value="medium">Moyen</option><option value="hard">Difficile</option></select></label>
        <label className="grid gap-1 text-sm">Couleur<select value={orientation} onChange={(e) => setOrientation(e.target.value as never)} className="rounded border p-2 text-ink"><option value="white">Blancs</option><option value="black">Noirs</option></select></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={training} onChange={(e) => setTraining(e.target.checked)} /> Mode entrainement</label>
        <label className="grid gap-1 text-sm">Assistance<select value={assist} onChange={(e) => setAssist(e.target.value as never)} className="rounded border p-2 text-ink"><option value="light">Legere</option><option value="guided">Guidee</option><option value="complete">Complete</option></select></label>
        <p className="rounded bg-coral/10 p-3 text-sm">{message}</p>
        <div className="max-h-40 overflow-auto rounded border p-3 text-sm dark:border-white/10">{history.length ? history.join(" ") : "Historique des coups"}</div>
        <textarea readOnly value={chess.pgn()} aria-label="PGN" className="min-h-24 rounded border p-3 text-sm text-ink" />
        <button className="rounded border px-4 py-2" onClick={() => update(new Chess())}>Nouvelle partie</button>
        <button className="rounded bg-ink px-4 py-3 text-white" onClick={save}>Sauvegarder et analyser</button>
      </aside>
    </main>
  );
}
