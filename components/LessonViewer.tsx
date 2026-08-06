"use client";

import { useMemo, useState } from "react";
import { Chess } from "chess.js";
import { courses } from "@/data/content";
import { pick } from "@/lib/i18n";
import { ChessBoard } from "@/components/ChessBoard";
import { BookOpen, CheckCircle2, Clock3, HelpCircle, Lightbulb, ListChecks, PlayCircle, Target, XCircle } from "lucide-react";

const lessons = courses.flatMap((course) => course.modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, course, module }))));

const courseStats = [
  { progress: 36, time: "18 min", last: "Aujourd'hui", wrong: "8 %", hints: "12 %", solutions: "0 %" },
  { progress: 18, time: "7 min", last: "Hier", wrong: "14 %", hints: "18 %", solutions: "3 %" },
  { progress: 0, time: "-", last: "-", wrong: "0 %", hints: "0 %", solutions: "0 %" }
];

export function LessonViewer() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [quiz, setQuiz] = useState("");
  const lesson = lessons[index];
  const activeCourseIndex = Math.max(0, courses.findIndex((course) => course.slug === lesson.course.slug));
  const content = lesson.content;
  const fen = useMemo(() => {
    const chess = new Chess(content.startFen);
    content.moves.slice(0, step).forEach((move) => chess.move(move.san));
    return chess.fen();
  }, [content, step]);

  function selectLesson(nextIndex: number) {
    setIndex(nextIndex);
    setStep(0);
    setQuiz("");
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8">
      <section className="grid gap-4 border-b border-black/10 pb-6 dark:border-white/10 lg:grid-cols-[1fr_330px] lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded bg-mint px-3 py-1 text-sm text-ink"><BookOpen size={16} /> Cours d&apos;echecs</p>
          <h1 className="mt-4 text-3xl font-semibold">Choisissez un niveau et lancez une lecon interactive</h1>
          <p className="mt-2 max-w-3xl text-sage dark:text-mint">Les cours sont organises comme un parcours: statut, temps utilise, mauvaises reponses, conseils utilises et demandes de solution. Vous pouvez commencer gratuitement et avancer coup par coup sur l&apos;echiquier.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded border border-black/10 p-3 text-center text-sm dark:border-white/10">
          <span><strong className="block text-lg">{courses.length}</strong> niveaux</span>
          <span><strong className="block text-lg">{lessons.length}</strong> lecons</span>
          <span><strong className="block text-lg">100%</strong> interactif</span>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Parcours disponibles</h2>
          <span className="rounded bg-coral/10 px-3 py-1 text-sm text-ink dark:text-white">Lecons gratuites disponibles</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {courses.map((course, courseIndex) => {
            const stats = courseStats[courseIndex] ?? courseStats[0];
            const courseLessons = course.modules.flatMap((module) => module.lessons);
            const firstLessonIndex = lessons.findIndex((item) => item.course.slug === course.slug);
            const active = course.slug === lesson.course.slug;

            return (
              <article key={course.slug} className={`grid gap-4 rounded border p-4 ${active ? "border-coral bg-coral/5" : "border-black/10 dark:border-white/10"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-sage dark:text-mint">Niveau {course.level}</p>
                    <h3 className="mt-1 text-xl font-semibold">{pick(course.title)}</h3>
                  </div>
                  {stats.progress ? <CheckCircle2 className="text-coral" size={22} /> : <PlayCircle className="text-brass" size={22} />}
                </div>
                <p className="text-sm text-sage dark:text-mint">{pick(course.description)}</p>
                <div>
                  <div className="mb-1 flex justify-between text-xs"><span>Statut</span><span>{stats.progress ? "En cours" : "A commencer"}</span></div>
                  <div className="h-2 overflow-hidden rounded bg-black/10 dark:bg-white/10"><div className="h-full bg-coral" style={{ width: `${stats.progress}%` }} /></div>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded bg-white p-2 dark:bg-white/5"><dt className="text-sage dark:text-mint">Temps utilise</dt><dd>{stats.time}</dd></div>
                  <div className="rounded bg-white p-2 dark:bg-white/5"><dt className="text-sage dark:text-mint">Dernier essai</dt><dd>{stats.last}</dd></div>
                  <div className="rounded bg-white p-2 dark:bg-white/5"><dt className="text-sage dark:text-mint">Mauvaises reponses</dt><dd>{stats.wrong}</dd></div>
                  <div className="rounded bg-white p-2 dark:bg-white/5"><dt className="text-sage dark:text-mint">Conseils utilises</dt><dd>{stats.hints}</dd></div>
                </dl>
                <button className="flex items-center justify-center gap-2 rounded bg-ink px-4 py-2 text-white dark:bg-coral" onClick={() => selectLesson(firstLessonIndex)}>
                  <PlayCircle size={17} /> Acceder aux lecons gratuites
                </button>
                <p className="text-xs text-sage dark:text-mint">{courseLessons.length} lecon{courseLessons.length > 1 ? "s" : ""} disponible{courseLessons.length > 1 ? "s" : ""} pour ce prototype.</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[290px_1fr_360px]">
        <aside className="grid content-start gap-3 rounded border border-black/10 p-4 dark:border-white/10">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><ListChecks size={19} /> Lecons du parcours</h2>
          {lessons.map((item, lessonIndex) => (
            <button
              key={`${item.course.slug}-${item.slug}`}
              className={`rounded border px-3 py-3 text-left text-sm ${lessonIndex === index ? "border-coral bg-coral/10" : "border-black/10 dark:border-white/10"}`}
              onClick={() => selectLesson(lessonIndex)}
            >
              <span className="block font-semibold">{pick(item.title)}</span>
              <span className="mt-1 block text-xs text-sage dark:text-mint">{pick(item.course.title)} · +{item.xpReward} XP</span>
            </button>
          ))}
        </aside>

        <section className="grid gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm text-coral"><Target size={16} /> Lecon interactive · Niveau {courses[activeCourseIndex]?.level ?? 1}</p>
            <h2 className="mt-2 text-3xl font-semibold">{pick(lesson.title)}</h2>
            <p className="mt-2 text-sage dark:text-mint">{pick(lesson.objective)}</p>
          </div>
          <div className="mx-auto w-full max-w-[620px]"><ChessBoard fen={fen} arrows={step ? [[content.moves[step - 1].from, content.moves[step - 1].to, "rgb(215,109,87)"]] : []} /></div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded border px-4 py-2" onClick={() => setStep(Math.max(0, step - 1))}>Reculer</button>
            <button className="rounded border px-4 py-2" onClick={() => setStep(Math.min(content.moves.length, step + 1))}>Avancer</button>
            <button className="rounded border px-4 py-2" onClick={() => setStep(0)}>Rejouer</button>
            <button className="rounded bg-ink px-4 py-2 text-white dark:bg-coral" onClick={() => selectLesson((index + 1) % lessons.length)}>Lecon suivante</button>
          </div>
        </section>

        <aside className="grid content-start gap-4 rounded border border-black/10 p-5 dark:border-white/10">
          <p>{pick(content.summary)}</p>
          <p className="rounded bg-coral/10 p-3 text-sm">{step ? pick(content.moves[step - 1].note) : "Avance coup par coup pour voir l'explication."}</p>
          <p className="flex items-start gap-2 text-sm text-sage dark:text-mint"><XCircle className="mt-0.5 shrink-0" size={16} /> {pick(content.mistake)}</p>
          <div className="rounded border p-4 dark:border-white/10">
            <h2 className="flex items-center gap-2 font-semibold"><HelpCircle size={18} /> Mini-quiz</h2>
            <p className="mt-2 text-sm">{pick(content.quiz.question)}</p>
            <div className="mt-3 grid gap-2">
              {content.quiz.answers.map((answer) => (
                <button key={pick(answer.text)} className="rounded border px-3 py-2 text-left text-sm" onClick={() => setQuiz(answer.correct ? "Correct, +XP !" : "Essaie encore.")}>{pick(answer.text)}</button>
              ))}
            </div>
            {quiz && <p className="mt-2 text-sm text-coral">{quiz}</p>}
          </div>
          <button className="flex items-center justify-center gap-2 rounded bg-coral px-4 py-3 text-white" onClick={() => setQuiz(`Indice : joue ${content.exercise.solution[0]}`)}><Lightbulb size={18} /> Demander un indice</button>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="rounded border p-2 dark:border-white/10"><Clock3 size={16} /> 3-7 min</span>
            <span className="rounded border p-2 dark:border-white/10">Solution {courseStats[activeCourseIndex]?.solutions ?? "0 %"}</span>
          </div>
        </aside>
      </section>
    </main>
  );
}
