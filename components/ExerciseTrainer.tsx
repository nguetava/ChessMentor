"use client";

import { useMemo, useState } from "react";
import { exercises } from "@/data/content";
import { ChessBoard } from "@/components/ChessBoard";

export function ExerciseTrainer() {
  const [current, setCurrent] = useState(0);
  const [fen, setFen] = useState(exercises[0].fen);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const exercise = exercises[current];
  const progress = useMemo(() => Math.round(((current + 1) / exercises.length) * 100), [current]);

  function next() {
    const nextIndex = (current + 1) % exercises.length;
    setCurrent(nextIndex);
    setFen(exercises[nextIndex].fen);
    setAttempts(0);
    setMessage("");
  }

  function onMove(_from: string, _to: string, san: string, nextFen: string) {
    const correct = exercise.solution.includes(san);
    setAttempts((value) => value + 1);
    if (correct) {
      setFen(nextFen);
      setMessage(`Bravo. Solution : ${exercise.solution.join(" ")}. +15 XP`);
      fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "exercise", slug: exercise.slug, correct: true }) });
    } else {
      setMessage("Ce coup ne resout pas le motif. Cherche les echecs, captures et menaces.");
    }
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <section className="mx-auto w-full max-w-[620px]"><ChessBoard fen={fen} onMove={onMove} orientation={exercise.sideToMove === "b" ? "black" : "white"} /></section>
      <aside className="grid content-start gap-4 rounded border border-black/10 p-5 dark:border-white/10">
        <p className="text-sm text-sage">Progression {progress}%</p>
        <h1 className="text-2xl font-semibold">{exercise.theme}</h1>
        <p>Difficulte : {exercise.difficulty}/3</p>
        <p>Camp a jouer : {exercise.sideToMove === "w" ? "Blancs" : "Noirs"}</p>
        <p>Tentatives : {attempts}</p>
        <button className="rounded border px-4 py-2" onClick={() => setMessage(`Indice : le premier coup commence par ${exercise.solution[0][0]}.`)}>Indice</button>
        <button className="rounded border px-4 py-2" onClick={() => { setFen(exercise.fen); setMessage(""); }}>Recommencer</button>
        {attempts >= 3 && <button className="rounded bg-coral px-4 py-2 text-white" onClick={() => setMessage(`Solution : ${exercise.solution.join(" ")}. ${exercise.explanation.fr}`)}>Voir la solution</button>}
        {message && <p role="status" className="rounded bg-black/5 p-3 text-sm dark:bg-white/10">{message}</p>}
        <button className="rounded bg-ink px-4 py-3 text-white" onClick={next}>Exercice suivant</button>
      </aside>
    </main>
  );
}
