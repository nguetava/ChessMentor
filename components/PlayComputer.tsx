"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { ChessBoard } from "@/components/ChessBoard";
import { chooseComputerMove, coachHints } from "@/lib/chess";
import { playMoveSound } from "@/lib/sound";
import { ArrowLeft, Brain, CalendarPlus, Clock, Lightbulb, RotateCcw, ShieldCheck, Sparkles, StepBack, Trophy, Users } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type Assistance = "light" | "guided" | "complete";
type Orientation = "white" | "black";

function buildGame(moves: string[]) {
  const game = new Chess();
  for (const san of moves) game.move(san);
  return game;
}

function gameStatus(game: Chess) {
  if (game.isCheckmate()) return "Echec et mat";
  if (game.isStalemate()) return "Pat";
  if (game.isDraw()) return "Partie nulle";
  if (game.isCheck()) return "Echec";
  return "Partie en cours";
}

export function PlayComputer() {
  const [moves, setMoves] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [training, setTraining] = useState(true);
  const [assist, setAssist] = useState<Assistance>("guided");
  const [message, setMessage] = useState("Mode entrainement actif : choisissez votre assistance, puis organisez la partie.");
  const [orientation, setOrientation] = useState<Orientation>("white");
  const [timeControl, setTimeControl] = useState("10+0");
  const [lessonGoal, setLessonGoal] = useState("roque");
  const [scheduled, setScheduled] = useState("Partie libre prete a demarrer");
  const [thinking, setThinking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hintStep, setHintStep] = useState(0);
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const replyTimer = useRef<number | null>(null);

  const chess = useMemo(() => buildGame(moves), [moves]);
  const history = chess.history();
  const userColor = orientation === "white" ? "w" : "b";
  const userTurn = chess.turn() === userColor;
  const gameOver = chess.isGameOver();
  const status = gameStatus(chess);
  const boardSize = gameStarted
    ? Math.max(300, Math.min(620, viewport.height - 250, viewport.width >= 1024 ? viewport.width - 520 : viewport.width - 40))
    : Math.max(300, Math.min(560, viewport.width - 80));

  useEffect(() => {
    function syncViewport() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const assistanceCopy = {
    light: "Assistance legere : avertissement avant les grosses erreurs, sans donner directement le meilleur coup.",
    guided: "Assistance guidee : zones importantes, questions de coach et indices progressifs.",
    complete: "Assistance complete : jusqu'a trois coups candidats, explication courte et variante sur demande."
  };

  function clearReplyTimer() {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = null;
  }

  function finishMessage(nextGame: Chess) {
    if (nextGame.isCheckmate()) {
      const winner = nextGame.turn() === "w" ? "les Noirs" : "les Blancs";
      setMessage(`Echec et mat : ${winner} gagnent la partie.`);
      return true;
    }
    if (nextGame.isDraw()) {
      setMessage(nextGame.isStalemate() ? "Pat : la partie est nulle." : "Partie terminee par nulle.");
      return true;
    }
    return false;
  }

  function setMoveLine(nextMoves: string[]) {
    setMoves(nextMoves);
    setHintStep(0);
    finishMessage(buildGame(nextMoves));
  }

  function queueComputerReply(nextMoves: string[]) {
    const position = buildGame(nextMoves);
    if (finishMessage(position)) {
      setThinking(false);
      return;
    }

    clearReplyTimer();
    setThinking(true);
    setMessage(training ? "L'ordinateur reflechit. Les conseils seront disponibles apres sa reponse." : "L'ordinateur reflechit.");
    replyTimer.current = window.setTimeout(() => {
      const next = buildGame(nextMoves);
      const computer = chooseComputerMove(next.fen(), difficulty);
      if (!computer) {
        setThinking(false);
        finishMessage(next);
        return;
      }

      const played = next.move(computer.san);
      playMoveSound(played?.captured ? "capture" : "move");
      const updatedMoves = next.history();
      setMoves(updatedMoves);
      setThinking(false);
      setHintStep(0);

      if (!finishMessage(next)) {
        setMessage(training ? "A vous de jouer. Vous pouvez demander un indice si vous voulez etre guide." : "A vous de jouer.");
      }
    }, difficulty === "hard" ? 180 : 90);
  }

  function organizeGame() {
    const side = orientation === "white" ? "Blancs" : "Noirs";
    const mode = training ? `entrainement ${assist}` : "normal sans conseils";
    clearReplyTimer();
    setMoves([]);
    setHintStep(0);
    setGameStarted(true);
    setThinking(false);
    setScheduled(`Partie organisee : ${side}, ${difficulty}, ${timeControl}, objectif "${lessonGoal}", mode ${mode}.`);
    setMessage(training ? assistanceCopy[assist] : "Mode normal : aucune aide en direct pendant la partie.");
    if (orientation === "black") queueComputerReply([]);
  }

  function onMove(_from: string, _to: string, san: string) {
    if (!gameStarted || thinking || gameOver || !userTurn) return;
    const nextMoves = [...moves, san];
    setMoveLine(nextMoves);
    queueComputerReply(nextMoves);
  }

  function undoHalfMove() {
    if (!moves.length) return;
    clearReplyTimer();
    const nextMoves = moves.slice(0, -1);
    setThinking(false);
    setMoveLine(nextMoves);
    setMessage("Un demi-coup a ete retire. Reprenez depuis cette position.");
  }

  function undoFullMove() {
    if (!moves.length) return;
    clearReplyTimer();
    const removeCount = orientation === "white" ? 2 : moves.length === 1 ? 1 : 2;
    const nextMoves = moves.slice(0, Math.max(0, moves.length - removeCount));
    setThinking(false);
    setMoveLine(nextMoves);
    setMessage("Retour en arriere effectue. Vous pouvez rejouer avec un autre plan.");
  }

  function resetCurrentGame() {
    clearReplyTimer();
    setMoves([]);
    setThinking(false);
    setHintStep(0);
    setMessage(training ? assistanceCopy[assist] : "Mode normal : aucune aide en direct pendant la partie.");
    if (orientation === "black") queueComputerReply([]);
  }

  function requestHint() {
    if (!training) {
      setMessage("Le mode entrainement est desactive : activez-le dans la configuration pour recevoir des indices.");
      return;
    }
    if (!userTurn) {
      setMessage(thinking ? "Attendez la reponse de l'ordinateur avant de demander un indice." : "Ce n'est pas encore votre tour.");
      return;
    }
    if (gameOver) {
      finishMessage(chess);
      return;
    }

    const hint = coachHints(chess.fen());
    const nextStep = hintStep + 1;
    setHintStep(nextStep);
    if (assist === "light") {
      setMessage(hint.light);
      return;
    }
    if (assist === "guided") {
      setMessage(nextStep === 1 ? hint.question : hint.guided);
      return;
    }
    setMessage(nextStep === 1 ? hint.question : nextStep === 2 ? hint.guided : `${hint.guided} Coups candidats : ${hint.candidates.join(", ")}.`);
  }

  async function save() {
    const result = chess.isDraw() ? "DRAW" : chess.isCheckmate() ? (chess.turn() === "w" ? "BLACK_WIN" : "WHITE_WIN") : "ONGOING";
    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pgn: chess.pgn(),
        result,
        color: orientation,
        difficulty,
        trainingMode: training,
        moves: history.map((san, i) => ({ san, fen: chess.fen(), ply: i + 1 }))
      })
    });
    const data = await res.json();
    window.location.href = `/analysis?id=${data.id ?? "local"}&pgn=${encodeURIComponent(chess.pgn())}`;
  }

  if (gameStarted) {
    return (
      <main className="mx-auto grid h-[calc(100svh-64px)] max-w-none grid-rows-[auto_minmax(0,1fr)] gap-2 overflow-hidden px-3 py-2">
        <header className="grid gap-2 rounded border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-white/5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-coral">{scheduled}</p>
            <h1 className="truncate text-xl font-semibold lg:text-2xl">{status}</h1>
            <p className="truncate text-sm text-sage dark:text-mint">{thinking ? "L'ordinateur calcule son coup..." : message}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10" onClick={() => { clearReplyTimer(); setGameStarted(false); setThinking(false); }}>
              <ArrowLeft size={16} /> Options
            </button>
            <button className="flex items-center gap-2 rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10" onClick={resetCurrentGame}>
              <RotateCcw size={16} /> Rejouer
            </button>
            <button className="flex items-center gap-2 rounded bg-coral px-3 py-2 text-sm text-white" onClick={save}>
              <Trophy size={16} /> Analyser
            </button>
          </div>
        </header>

        <section className="grid min-h-0 gap-3 overflow-hidden lg:grid-cols-[minmax(420px,1fr)_380px]">
          <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-2 overflow-hidden rounded border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto grid min-h-0 w-full max-w-[min(82svh,760px)] place-items-center overflow-hidden">
              <ChessBoard fen={chess.fen()} onMove={onMove} orientation={orientation} disabled={thinking || gameOver || !userTurn} boardWidth={boardSize} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button className="flex min-h-10 items-center justify-center gap-1 rounded border px-2 py-2 text-sm" onClick={undoHalfMove} disabled={!moves.length || thinking}>
                <StepBack size={16} /> 1 coup
              </button>
              <button className="flex min-h-10 items-center justify-center gap-1 rounded border px-2 py-2 text-sm" onClick={undoFullMove} disabled={!moves.length || thinking}>
                <StepBack size={16} /> Revenir
              </button>
              <button className="flex min-h-10 items-center justify-center gap-1 rounded bg-ink px-2 py-2 text-sm text-white dark:bg-coral" onClick={requestHint} disabled={!training || thinking || gameOver}>
                <Lightbulb size={16} /> Indice
              </button>
              <button className="flex min-h-10 items-center justify-center gap-1 rounded border px-2 py-2 text-sm" onClick={() => setMessage(gameStatus(chess))}>
                Etat
              </button>
            </div>
          </div>

          <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
            <div className="border-b border-black/10 p-3 dark:border-white/10">
              <h2 className="flex items-center gap-2 font-semibold"><Brain size={17} /> Assistant de partie</h2>
              <p className="mt-1 text-xs text-sage dark:text-mint">{training ? assistanceCopy[assist] : "Mode normal : assistance inactive."}</p>
            </div>
            <div className="grid min-h-0 content-start gap-3 overflow-y-auto p-3 text-sm">
              <div className="rounded bg-coral/10 p-3">
                <strong>Tour</strong>
                <p>{gameOver ? status : userTurn ? "A vous de jouer" : thinking ? "Ordinateur en reflexion" : "Tour de l'ordinateur"}</p>
              </div>
              <div className="rounded border border-black/10 p-3 dark:border-white/10">
                <strong>Historique</strong>
                <p className="mt-2 leading-relaxed">{history.length ? history.join(" ") : "Aucun coup joue"}</p>
              </div>
              <div className="rounded border border-black/10 p-3 dark:border-white/10">
                <strong>PGN</strong>
                <textarea readOnly value={chess.pgn()} aria-label="PGN" className="mt-2 h-28 w-full resize-none rounded border p-2 text-xs text-ink" />
              </div>
            </div>
            <div className="border-t border-black/10 p-3 text-xs text-sage dark:border-white/10 dark:text-mint">
              Le bouton Revenir retire les derniers coups pour reprendre une variante sans quitter la partie.
            </div>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8">
      <section className="grid gap-4 rounded border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5 lg:grid-cols-[1fr_320px] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded bg-mint px-3 py-1 text-sm text-ink"><CalendarPlus size={16} /> Organisateur de parties</p>
          <h1 className="mt-4 text-3xl font-semibold">Preparez une partie adaptee a votre objectif</h1>
          <p className="mt-2 max-w-3xl text-sage dark:text-mint">Choisissez le niveau, la cadence, la couleur, le mode normal ou entrainement, puis l&apos;assistance si l&apos;entrainement est actif. Le bouton lance ensuite une vraie table de jeu sans scroll global.</p>
        </div>
        <div className="rounded bg-coral/10 p-4 text-sm">
          <strong className="flex items-center gap-2"><ShieldCheck size={17} /> Etat</strong>
          <p className="mt-2">{scheduled}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_410px]">
        <div className="grid content-center gap-4 rounded border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="mx-auto w-full max-w-[660px]">
            <ChessBoard fen={chess.fen()} orientation={orientation} disabled boardWidth={boardSize} />
          </div>
          <p className="rounded bg-coral/10 p-3 text-sm">{message}</p>
        </div>

        <aside className="grid content-start gap-4 rounded border border-black/10 p-5 dark:border-white/10">
          <h2 className="flex items-center gap-2 text-2xl font-semibold"><Users size={22} /> Configurer la partie</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <label className="grid gap-1 text-sm">Difficulte<select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="rounded border p-2 text-ink"><option value="easy">Facile</option><option value="medium">Moyen</option><option value="hard">Difficile</option></select></label>
            <label className="grid gap-1 text-sm">Couleur<select value={orientation} onChange={(e) => setOrientation(e.target.value as Orientation)} className="rounded border p-2 text-ink"><option value="white">Blancs</option><option value="black">Noirs</option></select></label>
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
          <p className="text-xs text-sage dark:text-mint">Une fois lancee, la partie occupe la hauteur du navigateur avec les controles essentiels visibles.</p>
          <button className="flex items-center justify-center gap-2 rounded border px-4 py-2" onClick={() => { clearReplyTimer(); setMoves([]); setMessage("Nouvelle configuration prete."); }}><Clock size={17} /> Reinitialiser</button>
        </aside>
      </section>
    </main>
  );
}
