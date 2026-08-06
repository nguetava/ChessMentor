"use client";

import { useRef, useState } from "react";
import { Chess } from "chess.js";
import { ChessBoard } from "@/components/ChessBoard";
import { chooseComputerMove, coachHints } from "@/lib/chess";
import { playMoveSound } from "@/lib/sound";
import { Brain, CalendarPlus, Clock, ShieldCheck, Sparkles, Users } from "lucide-react";

export function PlayComputer() {
  const [chess, setChess] = useState(() => new Chess());
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [training, setTraining] = useState(true);
  const [assist, setAssist] = useState<"light" | "guided" | "complete">("guided");
  const [message, setMessage] = useState("Mode entrainement actif : choisissez votre assistance, puis jouez une partie organisee contre l'ordinateur.");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [timeControl, setTimeControl] = useState("10+0");
  const [lessonGoal, setLessonGoal] = useState("roque");
  const [scheduled, setScheduled] = useState("Partie libre prete a demarrer");
  const [history, setHistory] = useState<string[]>([]);
  const [thinking, setThinking] = useState(false);
  const replyTimer = useRef<number | null>(null);

  const assistanceCopy = {
    light: "Assistance legere : avertissement avant les grosses erreurs, sans donner directement le meilleur coup.",
    guided: "Assistance guidee : zones importantes, questions de coach et indices progressifs.",
    complete: "Assistance complete : jusqu'a trois coups candidats, explication courte et variante sur demande."
  };

  function update(next: Chess) {
    setChess(new Chess(next.fen()));
    setHistory(next.history());
  }

  function clearReplyTimer() {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = null;
  }

  function queueComputerReply(fen: string, playedSan?: string) {
    const position = new Chess(fen);
    if (position.isGameOver()) {
      setThinking(false);
      return;
    }

    clearReplyTimer();
    setThinking(true);
    setMessage(training ? "L'ordinateur reflechit. Les conseils restent actifs apres sa reponse." : "L'ordinateur reflechit.");
    replyTimer.current = window.setTimeout(() => {
      const next = new Chess(fen);
      const computer = chooseComputerMove(next.fen(), difficulty);
      if (computer) {
        const played = next.move(computer.san);
        playMoveSound(played?.captured ? "capture" : "move");
      }
      update(next);
      setThinking(false);
      const hint = coachHints(next.fen());
      setMessage(
        training
          ? assist === "light"
            ? hint.light
            : assist === "guided"
              ? hint.guided
              : `${hint.guided} Candidats : ${hint.candidates.join(", ")}`
          : playedSan
            ? `Vous avez joue ${playedSan}. Mode normal : pas d'assistance pendant la partie.`
            : "Mode normal : pas d'assistance pendant la partie."
      );
    }, 80);
  }

  function organizeGame() {
    const side = orientation === "white" ? "Blancs" : "Noirs";
    const mode = training ? `entrainement ${assist}` : "normal sans conseils";
    const next = new Chess();
    clearReplyTimer();
    setScheduled(`Partie organisee : ${side}, ${difficulty}, ${timeControl}, objectif "${lessonGoal}", mode ${mode}.`);
    setMessage(training ? assistanceCopy[assist] : "Mode normal : aucune aide en direct pendant la partie.");
    update(next);
    setThinking(false);
    if (orientation === "black") queueComputerReply(next.fen());
  }

  function onMove(_from: string, _to: string, san: string, fen: string) {
    update(new Chess(fen));
    queueComputerReply(fen, san);
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
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8">
      <section className="grid gap-4 rounded border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5 lg:grid-cols-[1fr_320px] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded bg-mint px-3 py-1 text-sm text-ink"><CalendarPlus size={16} /> Organisateur de parties</p>
          <h1 className="mt-4 text-3xl font-semibold">Preparez une partie adaptee a votre objectif</h1>
          <p className="mt-2 max-w-3xl text-sage dark:text-mint">Comme sur une plateforme d&apos;apprentissage, la partie n&apos;est pas lancee au hasard : vous choisissez le niveau, la cadence, la couleur, le mode normal ou entrainement, puis l&apos;assistance si l&apos;entrainement est actif.</p>
        </div>
        <div className="rounded bg-coral/10 p-4 text-sm">
          <strong className="flex items-center gap-2"><ShieldCheck size={17} /> Etat</strong>
          <p className="mt-2">{scheduled}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_410px]">
        <div className="mx-auto w-full max-w-[660px]">
          <ChessBoard fen={chess.fen()} onMove={onMove} orientation={orientation} disabled={thinking} />
        </div>
        <aside className="grid content-start gap-4 rounded border border-black/10 p-5 dark:border-white/10">
          <h2 className="flex items-center gap-2 text-2xl font-semibold"><Users size={22} /> Configurer la partie</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <label className="grid gap-1 text-sm">Difficulte<select value={difficulty} onChange={(e) => setDifficulty(e.target.value as never)} className="rounded border p-2 text-ink"><option value="easy">Facile</option><option value="medium">Moyen</option><option value="hard">Difficile</option></select></label>
            <label className="grid gap-1 text-sm">Couleur<select value={orientation} onChange={(e) => setOrientation(e.target.value as never)} className="rounded border p-2 text-ink"><option value="white">Blancs</option><option value="black">Noirs</option></select></label>
            <label className="grid gap-1 text-sm">Cadence<select value={timeControl} onChange={(e) => setTimeControl(e.target.value)} className="rounded border p-2 text-ink"><option value="sans chrono">Sans chrono</option><option value="10+0">10 min</option><option value="15+10">15 + 10</option><option value="30+0">30 min</option></select></label>
            <label className="grid gap-1 text-sm">Objectif pedagogique<select value={lessonGoal} onChange={(e) => setLessonGoal(e.target.value)} className="rounded border p-2 text-ink"><option value="roque">Roquer et proteger le roi</option><option value="centre">Controler le centre</option><option value="pieces">Developper les pieces</option><option value="tactique">Chercher echecs, captures, menaces</option></select></label>
          </div>

          <label className="flex items-center justify-between gap-3 rounded border border-black/10 p-3 text-sm dark:border-white/10">
            <span><strong>Mode entrainement</strong><br /><span className="text-sage dark:text-mint">Active les conseils pedagogiques en direct.</span></span>
            <input type="checkbox" checked={training} onChange={(e) => { setTraining(e.target.checked); setMessage(e.target.checked ? assistanceCopy[assist] : "Mode normal : aucune aide en direct pendant la partie."); }} />
          </label>

          <fieldset className={`grid gap-2 rounded border p-3 dark:border-white/10 ${training ? "border-coral/50 bg-coral/5" : "border-black/10 opacity-60"}`}>
            <legend className="flex items-center gap-2 px-1 text-sm font-semibold"><Brain size={16} /> Assistance disponible en entrainement</legend>
            {(["light", "guided", "complete"] as const).map((level) => (
              <label key={level} className="flex items-start gap-2 text-sm">
                <input type="radio" name="assist" value={level} checked={assist === level} disabled={!training} onChange={() => { setAssist(level); setMessage(assistanceCopy[level]); }} />
                <span>{assistanceCopy[level]}</span>
              </label>
            ))}
          </fieldset>

          <button className="flex items-center justify-center gap-2 rounded bg-ink px-4 py-3 text-white dark:bg-coral" onClick={organizeGame}><Sparkles size={18} /> Organiser cette partie</button>
          <p className="rounded bg-coral/10 p-3 text-sm">{thinking ? "L'ordinateur calcule son coup..." : message}</p>
          <div className="max-h-40 overflow-auto rounded border p-3 text-sm dark:border-white/10">{history.length ? history.join(" ") : "Historique des coups"}</div>
          <textarea readOnly value={chess.pgn()} aria-label="PGN" className="min-h-24 rounded border p-3 text-sm text-ink" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <button className="flex items-center justify-center gap-2 rounded border px-4 py-2" onClick={() => { clearReplyTimer(); setThinking(false); update(new Chess()); }}><Clock size={17} /> Nouvelle partie</button>
            <button className="rounded bg-coral px-4 py-3 text-white" onClick={save}>Sauvegarder et analyser</button>
          </div>
        </aside>
      </section>
    </main>
  );
}
