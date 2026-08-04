import Link from "next/link";
import { AuthPanel } from "@/components/AuthPanel";
import { AppShell } from "@/components/AppShell";
import { Award, BarChart3, Brain, Castle, GraduationCap, LineChart, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  const features = [
    ["Theorie progressive", GraduationCap],
    ["Exemples interactifs", Castle],
    ["Exercices tactiques", Brain],
    ["Parties contre ordinateur", Zap],
    ["Analyse apres partie", LineChart],
    ["Progression et badges", Award]
  ] as const;

  return (
    <AppShell>
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded bg-mint px-3 py-1 text-sm text-ink">Francais par defaut, Deutsch et English inclus</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-6xl">Apprenez les echecs, un coup a la fois</h1>
            <p className="mt-5 max-w-2xl text-lg text-sage dark:text-mint">ChessMentor combine cours, exercices, parties d&apos;entrainement, conseils en direct et analyse pour progresser sans se perdre dans le jargon.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#auth" className="rounded bg-ink px-5 py-3 font-medium text-white dark:bg-coral">Commencer gratuitement</Link>
              <Link href="/learn" className="rounded border border-black/10 px-5 py-3 font-medium dark:border-white/10">Decouvrir les cours</Link>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid aspect-square grid-cols-8 overflow-hidden rounded border-4 border-ink shadow-soft dark:border-paper">
              {Array.from({ length: 64 }).map((_, i) => <div key={i} className={(Math.floor(i / 8) + i) % 2 ? "bg-sage" : "bg-mint"} />)}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              {["Debutant", "Intermediaire", "Avance"].map((level) => <span key={level} className="rounded border border-black/10 px-3 py-2 dark:border-white/10">{level}</span>)}
            </div>
          </div>
        </section>
        <section className="bg-white py-12 dark:bg-white/5">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([label, Icon]) => (
              <article key={label} className="rounded border border-black/10 p-5 dark:border-white/10">
                <Icon className="text-coral" />
                <h2 className="mt-4 font-semibold">{label}</h2>
                <p className="mt-2 text-sm text-sage dark:text-mint">Un module concret, accessible au clavier, avec etats clairs et feedback immediat.</p>
              </article>
            ))}
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold">Comment ca marche</h2>
            <div className="mt-6 grid gap-3">
              {["Apprends une idee simple", "Manipule la position sur l'echiquier", "Resous un exercice", "Joue une partie guidee", "Revois les moments cles"].map((step, index) => (
                <div key={step} className="flex gap-4 rounded border border-black/10 p-4 dark:border-white/10">
                  <span className="grid h-8 w-8 place-items-center rounded bg-coral text-white">{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div id="auth"><AuthPanel /></div>
        </section>
        <section className="bg-ink px-4 py-12 text-paper dark:bg-paper dark:text-ink">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-3xl font-semibold">Pret a progresser ?</h2><p className="mt-2 opacity-80">Reprenez exactement ou vous vous etes arrete.</p></div>
            <Link href="/dashboard" className="rounded bg-coral px-5 py-3 font-medium text-white">Ouvrir le tableau de bord</Link>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-sage">
        <span>ChessMentor</span><span className="inline-flex items-center gap-2"><ShieldCheck size={16} /> Mode entrainement, pas de triche en ligne.</span>
      </footer>
    </AppShell>
  );
}
