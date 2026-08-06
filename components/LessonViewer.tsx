"use client";

import { useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Circle, Clock3, HelpCircle, Lightbulb, ListChecks, Lock, PlayCircle, RotateCcw, Target, Trophy } from "lucide-react";
import { ChessBoard } from "@/components/ChessBoard";
import { courses } from "@/data/content";
import { pick } from "@/lib/i18n";
import { playMoveSound } from "@/lib/sound";

type ViewMode = "courses" | "lessons" | "player";
type LessonStage = "theory" | "demo" | "exercise";

const STORAGE_KEY = "chessmentor.completedLessons";

const levelStats = [
  { time: "18 min", last: "Aujourd'hui", wrong: "8 %", hints: "12 %", solutions: "0 %" },
  { time: "7 min", last: "Hier", wrong: "14 %", hints: "18 %", solutions: "3 %" },
  { time: "-", last: "-", wrong: "0 %", hints: "0 %", solutions: "0 %" }
];

function courseLessons(courseIndex: number) {
  const course = courses[courseIndex];
  return course.modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, module })));
}

function lessonKey(courseIndex: number, lessonSlug: string) {
  return `${courses[courseIndex].slug}:${lessonSlug}`;
}

export function LessonViewer() {
  const [mode, setMode] = useState<ViewMode>("courses");
  const [courseIndex, setCourseIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<LessonStage>("theory");
  const [quiz, setQuiz] = useState("");
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());

  const course = courses[courseIndex];
  const lessons = useMemo(() => courseLessons(courseIndex), [courseIndex]);
  const lesson = lessons[lessonIndex];
  const content = lesson.content;
  const currentKey = lessonKey(courseIndex, lesson.slug);
  const completedCount = lessons.filter((item) => completed.has(lessonKey(courseIndex, item.slug))).length;
  const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const stats = levelStats[courseIndex] ?? levelStats[0];

  const fen = useMemo(() => {
    const chess = new Chess(content.startFen);
    content.moves.slice(0, step).forEach((move) => chess.move(move.san));
    return chess.fen();
  }, [content, step]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {
      setCompleted(new Set());
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
    } catch {
      // Local persistence is optional.
    }
  }, [completed]);

  function openCourse(nextCourseIndex: number) {
    setCourseIndex(nextCourseIndex);
    setLessonIndex(0);
    setStep(0);
    setStage("theory");
    setQuiz("");
    setMode("lessons");
  }

  function openLesson(nextLessonIndex: number) {
    if (!isLessonAvailable(nextLessonIndex)) return;
    setLessonIndex(nextLessonIndex);
    setStep(0);
    setStage("theory");
    setQuiz("");
    setMode("player");
  }

  function isLessonAvailable(index: number) {
    if (index === 0) return true;
    return completed.has(lessonKey(courseIndex, lessons[index - 1].slug));
  }

  function lessonGlobalIndex(moduleIndex: number, lessonInModuleIndex: number) {
    return course.modules.slice(0, moduleIndex).reduce((sum, module) => sum + module.lessons.length, 0) + lessonInModuleIndex;
  }

  function markComplete() {
    setCompleted((prev) => new Set(prev).add(currentKey));
    setQuiz("Lecon terminee. La suivante est maintenant disponible.");
  }

  function nextLesson() {
    const next = Math.min(lessonIndex + 1, lessons.length - 1);
    if (next !== lessonIndex) openLesson(next);
  }

  function advanceStep() {
    if (step >= content.moves.length) return;
    playMoveSound("move");
    setStep(step + 1);
  }

  const stageLabels: Record<LessonStage, string> = {
    theory: "Theorie",
    demo: "Demonstration",
    exercise: "Exercice"
  };

  if (mode === "courses") {
    const totalLessons = courses.reduce((sum, item) => sum + item.modules.flatMap((module) => module.lessons).length, 0);

    return (
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
        <header className="grid gap-3 border-b border-black/10 pb-6 dark:border-white/10">
          <p className="inline-flex w-fit items-center gap-2 rounded bg-mint px-3 py-1 text-sm text-ink"><BookOpen size={16} /> Cours d&apos;echecs</p>
          <h1 className="text-3xl font-semibold">Choisissez votre niveau</h1>
          <p className="max-w-3xl text-sage dark:text-mint">Commencez par un niveau de difficulte. Ensuite vous verrez uniquement les lecons de ce niveau, dans l&apos;ordre, avec les cours termines marques clairement.</p>
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <span className="rounded border border-black/10 p-3 dark:border-white/10"><strong>{courses.length}</strong> niveaux</span>
            <span className="rounded border border-black/10 p-3 dark:border-white/10"><strong>{totalLessons}</strong> lecons progressives</span>
            <span className="rounded border border-black/10 p-3 dark:border-white/10"><strong>Local</strong> sauvegarde du suivi</span>
          </div>
        </header>

        <section className="grid gap-4">
          {courses.map((item, index) => {
            const items = courseLessons(index);
            const done = items.filter((entry) => completed.has(lessonKey(index, entry.slug))).length;
            const itemProgress = items.length ? Math.round((done / items.length) * 100) : 0;
            const itemStats = levelStats[index] ?? levelStats[0];

            return (
              <article key={item.slug} className="grid gap-4 rounded border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5 lg:grid-cols-[1fr_240px] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase text-coral">Niveau {item.level}</p>
                  <h2 className="mt-1 text-2xl font-semibold">{pick(item.title)}</h2>
                  <p className="mt-2 max-w-3xl text-sm text-sage dark:text-mint">{pick(item.description)}</p>
                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                    <div className="rounded bg-paper p-3 dark:bg-night"><dt className="text-sage dark:text-mint">Statut</dt><dd>{done ? "En cours" : "A commencer"}</dd></div>
                    <div className="rounded bg-paper p-3 dark:bg-night"><dt className="text-sage dark:text-mint">Temps utilise</dt><dd>{itemStats.time}</dd></div>
                    <div className="rounded bg-paper p-3 dark:bg-night"><dt className="text-sage dark:text-mint">Dernier essai</dt><dd>{itemStats.last}</dd></div>
                  </dl>
                </div>
                <div className="grid gap-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs"><span>Progres</span><span>{itemProgress}%</span></div>
                    <div className="h-2 overflow-hidden rounded bg-black/10 dark:bg-white/10"><div className="h-full bg-coral" style={{ width: `${itemProgress}%` }} /></div>
                  </div>
                  <p className="text-sm text-sage dark:text-mint">{done}/{items.length} lecons terminees</p>
                  <button className="flex items-center justify-center gap-2 rounded bg-ink px-4 py-3 text-white dark:bg-coral" onClick={() => openCourse(index)}>
                    Acceder aux lecons <ChevronRight size={18} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    );
  }

  if (mode === "lessons") {
    return (
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
        <header className="grid gap-4 border-b border-black/10 pb-6 dark:border-white/10">
          <button className="flex w-fit items-center gap-2 rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10" onClick={() => setMode("courses")}>
            <ArrowLeft size={16} /> Tous les niveaux
          </button>
          <div className="grid gap-3 lg:grid-cols-[1fr_260px] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-coral">Niveau {course.level}</p>
              <h1 className="text-3xl font-semibold">{pick(course.title)}</h1>
              <p className="mt-2 max-w-3xl text-sage dark:text-mint">{pick(course.description)}</p>
            </div>
            <div className="rounded border border-black/10 p-4 dark:border-white/10">
              <div className="mb-1 flex justify-between text-sm"><span>Progres</span><strong>{progress}%</strong></div>
              <div className="h-2 overflow-hidden rounded bg-black/10 dark:bg-white/10"><div className="h-full bg-coral" style={{ width: `${progress}%` }} /></div>
              <p className="mt-2 text-sm text-sage dark:text-mint">{completedCount}/{lessons.length} lecons terminees</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded bg-mint px-3 py-1 text-ink"><PlayCircle size={15} /> Disponible</span>
            <span className="inline-flex items-center gap-1 rounded bg-coral/10 px-3 py-1"><Circle size={15} /> En cours</span>
            <span className="inline-flex items-center gap-1 rounded border border-black/10 px-3 py-1 dark:border-white/10"><Lock size={15} /> Bloque</span>
            <span className="inline-flex items-center gap-1 rounded bg-ink px-3 py-1 text-white dark:bg-coral"><CheckCircle2 size={15} /> Terminee</span>
          </div>
        </header>

        <section className="grid gap-6">
          {course.modules.map((module, moduleIndex) => (
            <div key={pick(module.title)} className="grid gap-3">
              <h2 className="rounded bg-mint px-4 py-3 text-lg font-semibold text-ink">{pick(module.title)}</h2>
              {module.lessons.map((item, lessonInModuleIndex) => {
                const index = lessonGlobalIndex(moduleIndex, lessonInModuleIndex);
                const key = lessonKey(courseIndex, item.slug);
                const done = completed.has(key);
                const available = isLessonAvailable(index);
                const locked = !available && !done;

                return (
                  <article key={item.slug} className={`grid gap-4 rounded border p-4 ${done ? "border-ink bg-ink text-white dark:border-coral dark:bg-coral" : locked ? "border-black/10 opacity-60 dark:border-white/10" : "border-coral bg-coral/5"}`}>
                    <div className="grid gap-3 lg:grid-cols-[44px_1fr_180px] lg:items-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded border border-current/20 text-lg font-semibold">{index + 1}</div>
                      <div>
                        <h3 className="text-xl font-semibold">{pick(item.title)}</h3>
                        <p className={`mt-1 text-sm ${done ? "text-white/80" : "text-sage dark:text-mint"}`}>{pick(item.objective)}</p>
                      </div>
                      <button
                        className={`flex items-center justify-center gap-2 rounded px-4 py-3 text-sm ${locked ? "border border-current/20" : done ? "bg-white text-ink" : "bg-ink text-white dark:bg-coral"}`}
                        disabled={locked}
                        onClick={() => openLesson(index)}
                      >
                        {locked ? <Lock size={17} /> : done ? <CheckCircle2 size={17} /> : <PlayCircle size={17} />}
                        {locked ? "Bloque" : done ? "Revoir" : index === 0 ? "Commencer" : "Continuer"}
                      </button>
                    </div>
                    <dl className={`grid gap-2 text-sm sm:grid-cols-5 ${done ? "text-white/80" : "text-sage dark:text-mint"}`}>
                      <div><dt>Statut</dt><dd>{done ? "Terminee" : locked ? "Terminez la lecon precedente" : "Vous pouvez commencer"}</dd></div>
                      <div><dt>Recommencee</dt><dd>0 x</dd></div>
                      <div><dt>Temps utilise</dt><dd>{index === 0 ? stats.time : "-"}</dd></div>
                      <div><dt>Mauvaises reponses</dt><dd>{done ? "0 %" : stats.wrong}</dd></div>
                      <div><dt>Conseils utilises</dt><dd>{done ? "0 %" : stats.hints}</dd></div>
                    </dl>
                  </article>
                );
              })}
            </div>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto grid h-[calc(100svh-124px)] max-w-none grid-rows-[auto_minmax(0,1fr)] gap-2 overflow-hidden px-3 py-2 lg:h-[calc(100svh-64px)] lg:max-w-7xl lg:px-4">
      <header className="grid gap-1 border-b border-black/10 pb-2 dark:border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button className="flex items-center gap-2 rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10" onClick={() => setMode("lessons")}>
            <ArrowLeft size={16} /> Lecons du niveau
          </button>
          {completed.has(currentKey) && <span className="inline-flex items-center gap-2 rounded bg-ink px-3 py-2 text-sm text-white dark:bg-coral"><CheckCircle2 size={17} /> Terminee</span>}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-coral">Lecon {lessonIndex + 1}/{lessons.length} - Niveau {course.level}</p>
          <h1 className="truncate text-xl font-semibold lg:text-2xl">{pick(lesson.title)}</h1>
          <p className="hidden max-w-5xl truncate text-sm text-sage dark:text-mint sm:block">{pick(lesson.objective)}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs sm:max-w-md">
          {(Object.keys(stageLabels) as LessonStage[]).map((item) => (
            <button
              key={item}
              className={`rounded border px-2 py-1.5 font-semibold ${stage === item ? "border-ink bg-ink text-white dark:border-coral dark:bg-coral" : "border-black/10 dark:border-white/10"}`}
              onClick={() => setStage(item)}
            >
              {stageLabels[item]}
            </button>
          ))}
        </div>
      </header>

      {stage === "theory" ? (
        <section className="grid min-h-0 gap-3 overflow-hidden md:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
            <div className="border-b border-black/10 p-3 dark:border-white/10">
              <p className="text-xs font-semibold uppercase text-coral">Avant de toucher aux pieces</p>
              <h2 className="text-xl font-semibold">La theorie de cette lecon</h2>
            </div>
            <div className="min-h-0 overflow-y-auto p-3">
              <div className="grid gap-3 text-sm">
                <section className="rounded bg-mint p-3 text-ink">
                  <h3 className="font-semibold">Idee principale</h3>
                  <p className="mt-2">{pick(content.summary)}</p>
                </section>
                <section className="rounded border border-black/10 p-3 dark:border-white/10">
                  <h3 className="flex items-center gap-2 font-semibold"><Target size={17} /> Methode a retenir</h3>
                  <p className="mt-2 text-sage dark:text-mint">{pick(content.method)}</p>
                </section>
                <section className="rounded border border-black/10 p-3 dark:border-white/10">
                  <h3 className="flex items-center gap-2 font-semibold"><ListChecks size={17} /> Points de controle</h3>
                  <ul className="mt-2 grid gap-1 text-sage dark:text-mint">
                    {content.checklist.map((item) => <li key={pick(item)}>- {pick(item)}</li>)}
                  </ul>
                </section>
                <section className="rounded border border-black/10 p-3 dark:border-white/10">
                  <h3 className="font-semibold">Erreur typique</h3>
                  <p className="mt-2 text-sage dark:text-mint">{pick(content.mistake)}</p>
                </section>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-black/10 p-3 dark:border-white/10">
              <button className="rounded border px-3 py-2 text-sm" onClick={() => setMode("lessons")}>Retour</button>
              <button className="flex items-center justify-center gap-2 rounded bg-ink px-3 py-2 text-sm text-white dark:bg-coral" onClick={() => setStage("demo")}>
                Voir l&apos;exemple <ChevronRight size={17} />
              </button>
            </div>
          </article>

          <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded border border-black/10 dark:border-white/10">
            <div className="border-b border-black/10 p-3 dark:border-white/10">
              <h2 className="flex items-center gap-2 font-semibold"><BookOpen size={17} /> Plan de travail</h2>
            </div>
            <div className="min-h-0 overflow-y-auto p-3 text-sm">
              <ol className="grid gap-2">
                <li className="rounded bg-ink p-3 text-white dark:bg-coral"><strong>1. Theorie</strong><br />Comprendre le principe avec des mots simples.</li>
                <li className="rounded border border-black/10 p-3 dark:border-white/10"><strong>2. Demonstration</strong><br />Observer le coup cle sur l&apos;echiquier.</li>
                <li className="rounded border border-black/10 p-3 dark:border-white/10"><strong>3. Exercice</strong><br />Repondre, demander un indice si besoin, puis valider.</li>
              </ol>
            </div>
            <div className="border-t border-black/10 p-3 text-xs text-sage dark:border-white/10 dark:text-mint">
              La lecon n&apos;est marquee terminee qu&apos;apres l&apos;exercice.
            </div>
          </aside>
        </section>
      ) : (
      <section className="grid min-h-0 gap-3 overflow-hidden md:grid-cols-[minmax(260px,1fr)_minmax(280px,360px)] xl:grid-cols-[minmax(420px,1fr)_390px]">
        <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-2 overflow-hidden">
          <div className="mx-auto grid min-h-0 w-full max-w-[min(48svh,440px)] place-items-center overflow-hidden sm:max-w-[min(54svh,520px)] lg:max-w-[min(62svh,600px)]">
            <ChessBoard fen={fen} arrows={step ? [[content.moves[step - 1].from, content.moves[step - 1].to, "rgb(215,109,87)"]] : []} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button className="flex min-h-10 items-center justify-center gap-1 rounded border px-2 py-2 text-sm" onClick={() => setStep(Math.max(0, step - 1))}><ArrowLeft size={16} /> Reculer</button>
            <button className="flex min-h-10 items-center justify-center gap-1 rounded border px-2 py-2 text-sm" onClick={() => setStep(0)}><RotateCcw size={16} /> Rejouer</button>
            <button className="flex min-h-10 items-center justify-center gap-1 rounded bg-ink px-2 py-2 text-sm text-white dark:bg-coral" onClick={advanceStep}>Avancer <ChevronRight size={16} /></button>
          </div>
        </div>

        <aside className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded border border-black/10 dark:border-white/10">
          <div className="min-h-0 overflow-y-auto p-3">
            <div className="grid gap-2 text-sm">
              <p>{pick(content.summary)}</p>
              <p className="rounded bg-coral/10 p-2">{step ? pick(content.moves[step - 1].note) : "Avancez coup par coup pour voir l'explication."}</p>
              <section className="rounded border border-black/10 p-2 dark:border-white/10">
                <h2 className="flex items-center gap-2 font-semibold"><Target size={17} /> Methode</h2>
                <p className="mt-2 text-sage dark:text-mint">{pick(content.method)}</p>
              </section>
              <section className="rounded border border-black/10 p-2 dark:border-white/10">
                <h2 className="flex items-center gap-2 font-semibold"><ListChecks size={17} /> Checklist</h2>
                <ul className="mt-2 grid gap-1 text-sage dark:text-mint">
                  {content.checklist.map((item) => <li key={pick(item)}>- {pick(item)}</li>)}
                </ul>
              </section>
              <p className="text-sage dark:text-mint">{pick(content.mistake)}</p>
              <section className="rounded border p-2 dark:border-white/10">
                <h2 className="flex items-center gap-2 font-semibold"><HelpCircle size={17} /> Question</h2>
                <p className="mt-2">{pick(content.quiz.question)}</p>
                <div className="mt-2 grid gap-2">
                  {content.quiz.answers.map((answer) => (
                    <button key={pick(answer.text)} className="rounded border px-3 py-2 text-left" onClick={() => setQuiz(answer.correct ? "Correct." : "Essaie encore.")}>{pick(answer.text)}</button>
                  ))}
                </div>
                {quiz && <p className="mt-2 text-coral">{quiz}</p>}
              </section>
              <section className="rounded bg-mint p-2 text-ink">
                <h2 className="font-semibold">Entrainement cible</h2>
                <p className="mt-2">{pick(content.training.prompt)}</p>
                <p className="mt-2">{pick(content.training.target)}</p>
              </section>
              <details className="rounded border border-black/10 p-2 dark:border-white/10">
                <summary className="cursor-pointer font-semibold">Criteres de maitrise</summary>
                <ul className="mt-2 grid gap-1 text-sage dark:text-mint">
                  {content.mastery.map((item) => <li key={pick(item)}>- {pick(item)}</li>)}
                </ul>
              </details>
            </div>
          </div>

          <div className="grid gap-2 border-t border-black/10 p-2 dark:border-white/10">
            <div className="grid grid-cols-2 gap-2">
              <button className="flex min-h-10 items-center justify-center gap-2 rounded border px-3 py-2 text-sm" onClick={() => setQuiz(`Indice : joue ${content.exercise.solution[0]}`)}><Lightbulb size={17} /> Indice</button>
              <button className="flex min-h-10 items-center justify-center gap-2 rounded bg-coral px-3 py-2 text-sm text-white" onClick={markComplete} disabled={completed.has(currentKey) || stage !== "exercise"}>
                <Trophy size={17} /> {completed.has(currentKey) ? "Terminee" : "Valider"}
              </button>
            </div>
            {stage === "demo" && (
              <button className="flex min-h-10 items-center justify-center gap-2 rounded bg-ink px-3 py-2 text-sm text-white dark:bg-coral" onClick={() => setStage("exercise")}>
                Passer a l&apos;exercice <ChevronRight size={17} />
              </button>
            )}
            {completed.has(currentKey) && lessonIndex < lessons.length - 1 && (
              <button className="flex min-h-10 items-center justify-center gap-2 rounded bg-ink px-3 py-2 text-sm text-white dark:bg-coral" onClick={nextLesson}>
                Lecon suivante <ChevronRight size={17} />
              </button>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs text-sage dark:text-mint">
              <span className="rounded border p-2 dark:border-white/10"><Clock3 size={14} /> 3-7 min</span>
              <span className="rounded border p-2 dark:border-white/10">Solution {stats.solutions}</span>
            </div>
          </div>
        </aside>
      </section>
      )}
    </main>
  );
}
