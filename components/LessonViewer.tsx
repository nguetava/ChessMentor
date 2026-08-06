"use client";

import { useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Circle, Clock3, HelpCircle, Lightbulb, ListChecks, Lock, PlayCircle, RotateCcw, Target, Trophy } from "lucide-react";
import { ChessBoard } from "@/components/ChessBoard";
import { courses } from "@/data/content";
import { pick } from "@/lib/i18n";
import { playMoveSound } from "@/lib/sound";

type ViewMode = "courses" | "lessons" | "player";
type CourseStepKind = "theory" | "demo" | "quiz" | "exercise" | "mastery";

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
  const [courseStep, setCourseStep] = useState(0);
  const [railOpen, setRailOpen] = useState(true);
  const [quiz, setQuiz] = useState("");
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });

  const course = courses[courseIndex];
  const lessons = useMemo(() => courseLessons(courseIndex), [courseIndex]);
  const lesson = lessons[lessonIndex];
  const content = lesson.content;
  const currentKey = lessonKey(courseIndex, lesson.slug);
  const completedCount = lessons.filter((item) => completed.has(lessonKey(courseIndex, item.slug))).length;
  const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const stats = levelStats[courseIndex] ?? levelStats[0];
  const boardSize = Math.max(
    360,
    Math.min(760, viewport.height - 210, viewport.width >= 1280 ? viewport.width - (railOpen ? 760 : 520) : viewport.width - 48)
  );

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

  useEffect(() => {
    function syncViewport() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  function openCourse(nextCourseIndex: number) {
    setCourseIndex(nextCourseIndex);
    setLessonIndex(0);
    setStep(0);
    setCourseStep(0);
    setQuiz("");
    setMode("lessons");
  }

  function openLesson(nextLessonIndex: number) {
    if (!isLessonAvailable(nextLessonIndex)) return;
    setLessonIndex(nextLessonIndex);
    setStep(0);
    setCourseStep(0);
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

  function lessonStatus(index: number, done: boolean, locked: boolean) {
    if (done) return "Terminee";
    if (locked) return "Bloquee";
    if (index === lessonIndex && mode === "player") return "En cours";
    return "Disponible";
  }

  function renderLessonRail() {
    if (!railOpen) {
      return (
        <aside className="hidden min-h-0 rounded border border-black/10 bg-white dark:border-white/10 dark:bg-white/5 xl:grid xl:place-items-start">
          <button
            className="grid h-full w-full place-items-center px-2 py-3 text-xs font-semibold uppercase text-coral [writing-mode:vertical-rl]"
            onClick={() => setRailOpen(true)}
          >
            Parcours
          </button>
        </aside>
      );
    }

    return (
      <aside className="hidden min-h-0 overflow-hidden rounded border border-black/10 bg-white dark:border-white/10 dark:bg-white/5 xl:grid xl:grid-rows-[auto_minmax(0,1fr)]">
        <div className="border-b border-black/10 p-3 dark:border-white/10">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase text-coral">Parcours</p>
            <button className="rounded border border-black/10 px-2 py-1 text-xs dark:border-white/10" onClick={() => setRailOpen(false)}>Plier</button>
          </div>
          <h2 className="truncate font-semibold">{pick(course.title)}</h2>
          <div className="mt-2 h-2 overflow-hidden rounded bg-black/10 dark:bg-white/10"><div className="h-full bg-coral" style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="min-h-0 overflow-y-auto p-2">
          {lessons.map((item, index) => {
            const key = lessonKey(courseIndex, item.slug);
            const done = completed.has(key);
            const locked = !isLessonAvailable(index) && !done;
            return (
              <button
                key={item.slug}
                disabled={locked}
                onClick={() => openLesson(index)}
                className={`mb-2 grid w-full grid-cols-[34px_1fr] gap-2 rounded border p-2 text-left text-xs transition ${
                  index === lessonIndex
                    ? "border-coral bg-coral/10"
                    : done
                      ? "border-ink bg-ink text-white dark:border-coral dark:bg-coral"
                      : locked
                        ? "border-black/10 opacity-50 dark:border-white/10"
                        : "border-black/10 hover:bg-mint/60 dark:border-white/10 dark:hover:bg-white/10"
                }`}
              >
                <span className="grid h-7 w-7 place-items-center rounded border border-current/20 font-semibold">{index + 1}</span>
                <span className="min-w-0">
                  <strong className="block truncate">{pick(item.title)}</strong>
                  <span className="text-sage dark:text-mint">{lessonStatus(index, done, locked)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  const theoryCards = [
    ...content.theoryCards.map((item) => ({
      title: pick(item.title),
      body: pick(item.body),
      plan: item.plan.map((point) => pick(point))
    })),
    { title: "Methode a retenir", body: pick(content.method), plan: content.checklist.map((item) => pick(item)).slice(0, 3) },
    { title: "Points de controle", body: content.checklist.map((item) => pick(item)), plan: content.checklist.map((item) => pick(item)).slice(0, 4) },
    { title: "Critere de maitrise", body: content.mastery.map((item) => pick(item)), plan: content.mastery.map((item) => pick(item)).slice(0, 4) }
  ];

  const courseSteps = [
    ...theoryCards.map((card, index) => ({ kind: "theory" as const, title: card.title, body: card.body, plan: card.plan, label: `Notion ${index + 1}` })),
    { kind: "demo" as const, title: "Exemple guide sur l'echiquier", body: pick(content.summary), plan: content.moves.map((move) => pick(move.note)), label: "Exemple" },
    { kind: "quiz" as const, title: "Question de comprehension", body: pick(content.quiz.question), plan: content.checklist.map((item) => pick(item)).slice(0, 4), label: "Quiz" },
    { kind: "exercise" as const, title: "Exercice interactif", body: `Trouve le coup cle : ${content.exercise.solution[0]}. Tu peux demander un indice, puis valider la lecon.`, plan: [pick(content.training.prompt), pick(content.training.target), pick(content.training.repeat)], label: "Exercice" },
    { kind: "mastery" as const, title: "Criteres de maitrise", body: content.mastery.map((item) => pick(item)), plan: content.mastery.map((item) => pick(item)), label: "Maitrise" }
  ];
  const currentCourseStep = courseSteps[Math.min(courseStep, courseSteps.length - 1)];
  const currentTheoryCard = currentCourseStep.kind === "theory" ? currentCourseStep : theoryCards[0];
  const planIllustration = (() => {
    if (currentCourseStep.plan.length > 0) {
      return {
        title: currentCourseStep.title,
        accent: currentCourseStep.kind === "demo" ? "Observe comment l'echiquier illustre la notion avant de jouer." : currentCourseStep.kind === "exercise" ? "Joue le coup sur le plateau, puis valide la lecon." : "Regarde le plateau avec cette idee en tete avant de passer a la suite.",
        points: currentCourseStep.plan
      };
    }
    if (currentTheoryCard.title === "Le but du jeu") {
      return {
        title: "A retenir maintenant",
        accent: "Objectif : mettre le roi adverse en echec et mat.",
        points: [
          "Le roi est la seule piece qu'on ne peut jamais laisser en prise.",
          "Un echec oblige a repondre tout de suite.",
          "Le mat arrive quand aucune reponse ne sauve le roi."
        ]
      };
    }
    if (currentTheoryCard.title === "L'echiquier") {
      return {
        title: "Lire le plateau",
        accent: "Regarde les coordonnees comme une carte : colonne + rangee.",
        points: [
          "Les colonnes vont de a a h.",
          "Les rangees vont de 1 a 8.",
          "Une case se nomme par exemple e4, d5 ou h8."
        ]
      };
    }
    if (currentTheoryCard.title === "Les pieces et leur role") {
      return {
        title: "Famille des pieces",
        accent: "Chaque piece a une mission differente.",
        points: [
          "Roi : survivre et se rapprocher en finale.",
          "Dame et tours : pieces lourdes, tres fortes sur lignes ouvertes.",
          "Fous, cavaliers et pions : controle, blocage, attaques courtes."
        ]
      };
    }
    if (currentTheoryCard.title === "Points de controle") {
      return {
        title: "Auto-questionnement",
        accent: "Avant de jouer, passe ces questions dans l'ordre.",
        points: Array.isArray(currentTheoryCard.body) ? currentTheoryCard.body.slice(0, 4) : content.checklist.map((item) => pick(item)).slice(0, 4)
      };
    }
    if (currentTheoryCard.title === "Erreur typique" || currentTheoryCard.title === "Erreur a neutraliser") {
      return {
        title: "Signal d'alerte",
        accent: "Si tu reconnais cette erreur, ralentis avant de jouer.",
        points: [
          pick(content.mistake),
          "Reviens a la methode.",
          "Cherche la meilleure reponse adverse avant de valider."
        ]
      };
    }
    return {
      title: "Fil conducteur",
      accent: "Comprendre l'idee avant de regarder le coup.",
      points: [
        "Lis la carte courante.",
        "Reformule l'idee avec tes mots.",
        "Passe ensuite seulement a l'exemple sur l'echiquier."
      ]
    };
  })();

  function previousCourseStep() {
    if (currentCourseStep.kind === "demo" && step > 0) {
      setStep(Math.max(0, step - 1));
      return;
    }
    setCourseStep(Math.max(0, courseStep - 1));
    setQuiz("");
  }

  function nextCourseStep() {
    if (currentCourseStep.kind === "demo" && step < content.moves.length) {
      advanceStep();
      return;
    }
    if (currentCourseStep.kind === "exercise" && !completed.has(currentKey)) {
      markComplete();
      return;
    }
    setCourseStep(Math.min(courseSteps.length - 1, courseStep + 1));
    setStep(0);
    setQuiz("");
  }

  const displayFen = currentCourseStep.kind === "demo" ? fen : content.startFen;
  const displayArrows = currentCourseStep.kind === "demo" && step ? [[content.moves[step - 1].from, content.moves[step - 1].to, "rgb(215,109,87)"]] as [string, string, string?][] : [];

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
      <main className="mx-auto grid h-[calc(100svh-124px)] max-w-none grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden px-3 py-3 lg:h-[calc(100svh-64px)] lg:px-5">
        <header className="grid gap-3 border-b border-black/10 pb-3 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex w-fit items-center gap-2 rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10" onClick={() => setMode("courses")}>
              <ArrowLeft size={16} /> Tous les niveaux
            </button>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded bg-mint px-2 py-1 text-ink"><PlayCircle size={14} /> Disponible</span>
              <span className="inline-flex items-center gap-1 rounded bg-coral/10 px-2 py-1"><Circle size={14} /> En cours</span>
              <span className="inline-flex items-center gap-1 rounded border border-black/10 px-2 py-1 dark:border-white/10"><Lock size={14} /> Bloquee</span>
              <span className="inline-flex items-center gap-1 rounded bg-ink px-2 py-1 text-white dark:bg-coral"><CheckCircle2 size={14} /> Terminee</span>
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-[1fr_520px] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-coral">Niveau {course.level}</p>
              <h1 className="text-2xl font-semibold lg:text-3xl">{pick(course.title)}</h1>
              <p className="mt-1 max-w-4xl text-sm text-sage dark:text-mint">{pick(course.description)}</p>
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-4">
              <div className="rounded border border-black/10 p-3 dark:border-white/10"><span className="text-sage dark:text-mint">Progres</span><strong className="block text-lg">{progress}%</strong></div>
              <div className="rounded border border-black/10 p-3 dark:border-white/10"><span className="text-sage dark:text-mint">Terminees</span><strong className="block text-lg">{completedCount}/{lessons.length}</strong></div>
              <div className="rounded border border-black/10 p-3 dark:border-white/10"><span className="text-sage dark:text-mint">Erreurs</span><strong className="block text-lg">{stats.wrong}</strong></div>
              <div className="rounded border border-black/10 p-3 dark:border-white/10"><span className="text-sage dark:text-mint">Conseils</span><strong className="block text-lg">{stats.hints}</strong></div>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded bg-black/10 dark:bg-white/10"><div className="h-full bg-coral" style={{ width: `${progress}%` }} /></div>
        </header>

        <section className="min-h-0 overflow-y-auto pr-1">
          <div className="grid gap-4 xl:grid-cols-2">
          {course.modules.map((module, moduleIndex) => (
            <div key={pick(module.title)} className="grid content-start gap-2">
              <h2 className="rounded bg-mint px-3 py-2 text-base font-semibold text-ink">{pick(module.title)}</h2>
              {module.lessons.map((item, lessonInModuleIndex) => {
                const index = lessonGlobalIndex(moduleIndex, lessonInModuleIndex);
                const key = lessonKey(courseIndex, item.slug);
                const done = completed.has(key);
                const available = isLessonAvailable(index);
                const locked = !available && !done;

                return (
                  <article key={item.slug} className={`grid gap-2 rounded border p-3 ${done ? "border-ink bg-ink text-white dark:border-coral dark:bg-coral" : locked ? "border-black/10 opacity-60 dark:border-white/10" : "border-coral bg-coral/5"}`}>
                    <div className="grid gap-3 lg:grid-cols-[40px_1fr_148px] lg:items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded border border-current/20 text-base font-semibold">{index + 1}</div>
                      <div>
                        <h3 className="text-base font-semibold lg:text-lg">{pick(item.title)}</h3>
                        <p className={`mt-1 text-sm ${done ? "text-white/80" : "text-sage dark:text-mint"}`}>{pick(item.objective)}</p>
                      </div>
                      <button
                        className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-sm ${locked ? "border border-current/20" : done ? "bg-white text-ink" : "bg-ink text-white dark:bg-coral"}`}
                        disabled={locked}
                        onClick={() => openLesson(index)}
                      >
                        {locked ? <Lock size={17} /> : done ? <CheckCircle2 size={17} /> : <PlayCircle size={17} />}
                        {locked ? "Bloque" : done ? "Revoir" : index === 0 ? "Commencer" : "Continuer"}
                      </button>
                    </div>
                    <dl className={`grid gap-2 text-xs sm:grid-cols-5 ${done ? "text-white/80" : "text-sage dark:text-mint"}`}>
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
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto grid h-[calc(100svh-124px)] max-w-none overflow-hidden px-3 py-2 lg:h-[calc(100svh-64px)] lg:max-w-[1900px] lg:px-4">
      <section className={`grid min-h-0 gap-3 overflow-hidden ${railOpen ? "xl:grid-cols-[280px_minmax(520px,1fr)_420px]" : "xl:grid-cols-[48px_minmax(520px,1fr)_420px]"}`}>
        {renderLessonRail()}

        <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 p-3 dark:border-white/10">
            <button className="flex items-center gap-2 rounded border border-black/10 px-3 py-2 text-sm dark:border-white/10" onClick={() => setMode("lessons")}>
              <ArrowLeft size={16} /> Niveau
            </button>
            <div className="min-w-0 flex-1 text-center">
              <p className="text-xs font-semibold uppercase text-coral">Lecon {lessonIndex + 1}/{lessons.length} - {currentCourseStep.label}</p>
              <h1 className="truncate text-lg font-semibold">{pick(lesson.title)}</h1>
            </div>
            {completed.has(currentKey) && <span className="inline-flex items-center gap-2 rounded bg-ink px-2 py-1 text-xs text-white dark:bg-coral"><CheckCircle2 size={15} /> Terminee</span>}
          </div>

          <div className="grid min-h-0 place-items-center overflow-hidden p-2">
            <ChessBoard fen={displayFen} arrows={displayArrows} boardWidth={boardSize} disabled={currentCourseStep.kind !== "exercise"} />
          </div>

          <div className="grid grid-cols-4 gap-2 border-t border-black/10 p-2 dark:border-white/10">
            <button className="flex min-h-10 items-center justify-center gap-1 rounded border px-2 py-2 text-sm" onClick={previousCourseStep} disabled={courseStep === 0 && step === 0}>
              <ArrowLeft size={16} /> Precedent
            </button>
            <button className="flex min-h-10 items-center justify-center gap-1 rounded border px-2 py-2 text-sm" onClick={() => { setStep(0); setCourseStep(0); setQuiz(""); }}>
              <RotateCcw size={16} /> Reprendre
            </button>
            <button className="flex min-h-10 items-center justify-center gap-1 rounded border px-2 py-2 text-sm" onClick={() => setQuiz(`Indice : joue ${content.exercise.solution[0]}`)}>
              <Lightbulb size={16} /> Indice
            </button>
            <button className="flex min-h-10 items-center justify-center gap-1 rounded bg-ink px-2 py-2 text-sm text-white dark:bg-coral" onClick={nextCourseStep}>
              {currentCourseStep.kind === "exercise" && !completed.has(currentKey) ? "Valider" : "Avancer"} <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
          <div className="border-b border-black/10 p-3 dark:border-white/10">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold uppercase text-coral">{currentCourseStep.label}</span>
              <span>{courseStep + 1}/{courseSteps.length}</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-black/10 dark:bg-white/10">
              <div className="h-full bg-coral" style={{ width: `${((courseStep + 1) / courseSteps.length) * 100}%` }} />
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto p-4">
            <article className="grid content-start gap-4">
              <h2 className="flex items-center gap-2 text-2xl font-semibold"><BookOpen size={22} /> {currentCourseStep.title}</h2>
              {Array.isArray(currentCourseStep.body) ? (
                <ul className="grid gap-2 text-sm leading-relaxed">
                  {currentCourseStep.body.map((item) => <li key={item} className="rounded border border-black/10 p-3 dark:border-white/10">{item}</li>)}
                </ul>
              ) : (
                <p className="text-base leading-relaxed text-sage dark:text-mint">{currentCourseStep.body}</p>
              )}

              {currentCourseStep.kind === "demo" && (
                <p className="rounded bg-coral/10 p-3 font-semibold">{step ? pick(content.moves[step - 1].note) : "Appuie sur Avancer pour jouer l'exemple coup par coup sur le grand echiquier."}</p>
              )}

              {currentCourseStep.kind === "quiz" && (
                <section className="grid gap-2">
                  {content.quiz.answers.map((answer) => (
                    <button key={pick(answer.text)} className="rounded border px-3 py-2 text-left" onClick={() => setQuiz(answer.correct ? "Correct." : "Essaie encore.")}>{pick(answer.text)}</button>
                  ))}
                  {quiz && <p className="text-coral">{quiz}</p>}
                </section>
              )}

              {currentCourseStep.kind === "exercise" && (
                <section className="rounded bg-mint p-3 text-ink">
                  <h3 className="font-semibold">A toi de jouer</h3>
                  <p className="mt-2">{pick(content.training.prompt)}</p>
                  <p className="mt-2">{quiz || "Joue le coup sur le grand echiquier ou demande un indice."}</p>
                </section>
              )}

              <section className="grid gap-2">
                <h3 className="flex items-center gap-2 font-semibold"><ListChecks size={17} /> Plan de travail</h3>
                <p className="rounded bg-coral/10 p-3 font-semibold">{planIllustration.accent}</p>
                <ul className="grid gap-2 text-sm">
                  {planIllustration.points.map((point) => (
                    <li key={point} className="rounded border border-black/10 p-3 dark:border-white/10">{point}</li>
                  ))}
                </ul>
              </section>
            </article>
          </div>

          <div className="grid gap-2 border-t border-black/10 p-3 text-xs text-sage dark:border-white/10 dark:text-mint">
            {completed.has(currentKey) && lessonIndex < lessons.length - 1 ? (
              <button className="flex min-h-10 items-center justify-center gap-2 rounded bg-ink px-3 py-2 text-sm text-white dark:bg-coral" onClick={nextLesson}>
                Lecon suivante <ChevronRight size={17} />
              </button>
            ) : (
              <span className="rounded border p-2 dark:border-white/10"><Clock3 size={14} /> Parcours unique : notion, exemple, question, exercice, maitrise.</span>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
