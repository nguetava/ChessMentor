import Link from "next/link";
import { AuthPanel } from "@/components/AuthPanel";
import { AppShell } from "@/components/AppShell";
import { Award, BarChart3, Brain, Castle, GraduationCap, LineChart, ShieldCheck, Users, Zap } from "lucide-react";

export default function HomePage() {
  const features = [
    ["Cours d'echecs", GraduationCap, "Des lecons courtes avec echiquier, objectifs et exercices pour apprendre sans livre lourd."],
    ["Jouer aux echecs", Castle, "Des parties organisees contre l'ordinateur, avec couleur, rythme et objectif pedagogique."],
    ["Defi tactique", Brain, "Dix positions jouables pour travailler mats, fourchettes, clouages et finales."],
    ["Tableau de progression", BarChart3, "XP, serie quotidienne, badges, reussite et points faibles restent visibles."],
    ["Entrainement guide", Zap, "Quand le mode entrainement est actif, vous choisissez assistance legere, guidee ou complete."],
    ["Analyse apres partie", LineChart, "Chaque partie sauvegardee revient avec moments cles, erreurs et conseils simples."]
  ] as const;

  const entryPoints = [
    { href: "/learn", title: "Cours d'echecs", text: "Apprendre une idee, voir l'exemple, refaire le coup.", icon: GraduationCap },
    { href: "/play", title: "Organiser une partie", text: "Choisir couleur, difficulte, cadence, mode normal ou entrainement.", icon: Users },
    { href: "/practice", title: "Defi tactique", text: "Resoudre des positions et revoir plus souvent les themes rates.", icon: Brain },
    { href: "/dashboard", title: "Mes progres", text: "Suivre niveau, badges, points faibles et recommandations.", icon: Award }
  ] as const;

  return (
    <AppShell>
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded bg-mint px-3 py-1 text-sm text-ink">Francais par defaut, Deutsch et English inclus</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-6xl">Apprenez a jouer avec une vraie methode interactive</h1>
            <p className="mt-5 max-w-2xl text-lg text-sage dark:text-mint">Cours, defis tactiques, parties organisees et suivi de progression : ChessMentor vous accompagne comme un entraineur calme, clair et toujours disponible.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#auth" className="rounded bg-ink px-5 py-3 font-medium text-white dark:bg-coral">Commencer gratuitement</Link>
              <Link href="/play" className="rounded border border-black/10 px-5 py-3 font-medium dark:border-white/10">Organiser une partie</Link>
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
        <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {entryPoints.map(({ href, title, text, icon: Icon }) => (
            <Link key={title} href={href} className="rounded border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-white/5">
              <Icon className="text-coral" aria-hidden />
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-sage dark:text-mint">{text}</p>
            </Link>
          ))}
        </section>
        <section className="bg-white py-12 dark:bg-white/5">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([label, Icon, text]) => (
              <article key={label} className="rounded border border-black/10 p-5 dark:border-white/10">
                <Icon className="text-coral" />
                <h2 className="mt-4 font-semibold">{label}</h2>
                <p className="mt-2 text-sm text-sage dark:text-mint">{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold">Comment ca marche</h2>
            <div className="mt-6 grid gap-3">
              {["Choisis un parcours ou organise une partie", "Active le mode entrainement si tu veux etre guide", "Selectionne le niveau d'assistance adapte", "Joue, sauvegarde et analyse la partie", "Reprends les positions critiques en exercice"].map((step, index) => (
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
