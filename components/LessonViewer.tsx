"use client";

import { useMemo, useState } from "react";
import { Chess } from "chess.js";
import { courses } from "@/data/content";
import { pick } from "@/lib/i18n";
import { ChessBoard } from "@/components/ChessBoard";

const lessons = courses.flatMap((course) => course.modules.flatMap((module) => module.lessons));

export function LessonViewer() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [quiz, setQuiz] = useState("");
  const lesson = lessons[index];
  const content = lesson.content;
  const fen = useMemo(() => {
    const chess = new Chess(content.startFen);
    content.moves.slice(0, step).forEach((move) => chess.move(move.san));
    return chess.fen();
  }, [content, step]);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <section className="grid gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-coral">Lecon interactive</p>
          <h1 className="text-3xl font-semibold">{pick(lesson.title)}</h1>
          <p className="mt-2 text-sage">{pick(lesson.objective)}</p>
        </div>
        <div className="mx-auto w-full max-w-[620px]"><ChessBoard fen={fen} arrows={step ? [[content.moves[step - 1].from, content.moves[step - 1].to, "rgb(215,109,87)"]] : []} /></div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded border px-4 py-2" onClick={() => setStep(Math.max(0, step - 1))}>Reculer</button>
          <button className="rounded border px-4 py-2" onClick={() => setStep(Math.min(content.moves.length, step + 1))}>Avancer</button>
          <button className="rounded border px-4 py-2" onClick={() => setStep(0)}>Rejouer</button>
          <button className="rounded bg-ink px-4 py-2 text-white" onClick={() => setIndex((index + 1) % lessons.length)}>Lecon suivante</button>
        </div>
      </section>
      <aside className="grid content-start gap-4 rounded border border-black/10 p-5 dark:border-white/10">
        <p>{pick(content.summary)}</p>
        <p className="rounded bg-coral/10 p-3 text-sm">{step ? pick(content.moves[step - 1].note) : "Avance coup par coup pour voir l'explication."}</p>
        <p className="text-sm text-sage">{pick(content.mistake)}</p>
        <div className="rounded border p-4 dark:border-white/10">
          <h2 className="font-semibold">Mini-quiz</h2>
          <p className="mt-2 text-sm">{pick(content.quiz.question)}</p>
          <div className="mt-3 grid gap-2">
            {content.quiz.answers.map((answer) => (
              <button key={pick(answer.text)} className="rounded border px-3 py-2 text-left text-sm" onClick={() => setQuiz(answer.correct ? "Correct, +XP !" : "Essaie encore.")}>{pick(answer.text)}</button>
            ))}
          </div>
          {quiz && <p className="mt-2 text-sm text-coral">{quiz}</p>}
        </div>
        <button className="rounded bg-coral px-4 py-3 text-white" onClick={() => setQuiz(`Indice : joue ${content.exercise.solution[0]}`)}>Demander un indice</button>
      </aside>
    </main>
  );
}
