import Link from "next/link";
import { AuthPanel } from "@/components/AuthPanel";
import { AppShell } from "@/components/AppShell";
import { Award, BarChart3, Brain, Castle, CheckCircle2, GraduationCap, LineChart, School, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";

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
    { href: "/learn", title: "Cours d'echecs", text: "Apprendre une idee, voir l'exemple, refaire le coup.", icon: GraduationCap, accent: "bg-mint" },
    { href: "/play", title: "Jouer aux echecs", text: "Organiser une partie avec couleur, niveau, cadence et mode entrainement.", icon: Castle, accent: "bg-coral/15" },
    { href: "/practice", title: "Defi tactique", text: "Resoudre des positions et revoir plus souvent les themes rates.", icon: Brain, accent: "bg-brass/15" },
    { href: "/dashboard", title: "Tableau logique", text: "Suivre progres, badges, points faibles et recommandations.", icon: BarChart3, accent: "bg-sage/15" }
  ] as const;

  const audiences = [
    {
      title: "Joueur occasionnel",
      icon: Users,
      points: [
        "Materiel interactif pour debutants, familles, enfants, seniors et joueurs de club.",
        "Lecons gratuites, exercices courts et parties guidees contre l'ordinateur.",
        "Mode entrainement avec assistance legere, guidee ou complete selon votre besoin."
      ]
    },
    {
      title: "Club d'echecs",
      icon: School,
      points: [
        "Progression lisible pour suivre le travail autonome de plusieurs joueurs.",
        "Defis tactiques, badges, statistiques et points faibles par theme.",
        "Architecture prete pour invitations, clubs, parties entre amis et classement Elo."
      ]
    }
  ] as const;

  const testimonials = [
    ["Claire", "J'ai enfin compris les bases sans devoir regarder une longue video."],
    ["Samir", "Le mode entrainement me force a reflechir avant de jouer trop vite."],
    ["Nora", "Les defis tactiques donnent envie de refaire une position jusqu'a comprendre."]
  ] as const;

  return (
    <AppShell>
      <main>
        <section className="border-b border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-3 text-sm">
            {entryPoints.map(({ href, title, icon: Icon }) => (
              <Link key={title} href={href} className="inline-flex items-center gap-2 rounded border border-black/10 px-3 py-2 hover:bg-mint dark:border-white/10 dark:hover:bg-white/10">
                <Icon size={16} aria-hidden />
                {title}
              </Link>
            ))}
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded bg-mint px-3 py-1 text-sm text-ink">Vous manquez de temps ou de motivation pour apprendre avec des livres ?</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-6xl">Apprenez les echecs facilement, en jouant vraiment</h1>
            <p className="mt-5 max-w-2xl text-lg text-sage dark:text-mint">ChessMentor transforme l&apos;apprentissage en parcours interactif : cours, parties organisees, defi tactique, tableau de progression et analyse apres partie dans une seule application.</p>
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
          {entryPoints.map(({ href, title, text, icon: Icon, accent }) => (
            <Link key={title} href={href} className={`rounded border border-black/10 p-5 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-white/5 ${accent}`}>
              <Icon className="text-ink dark:text-paper" aria-hidden />
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-sage dark:text-mint">{text}</p>
            </Link>
          ))}
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 lg:grid-cols-2">
          {audiences.map(({ title, icon: Icon, points }) => (
            <article key={title} className="rounded border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded bg-coral/15 text-coral"><Icon aria-hidden /></span>
                <h2 className="text-2xl font-semibold">{title}</h2>
              </div>
              <ul className="mt-5 grid gap-3 text-sm text-sage dark:text-mint">
                {points.map((point) => (
                  <li key={point} className="flex gap-3"><CheckCircle2 className="mt-0.5 min-w-5 text-coral" size={18} aria-hidden />{point}</li>
                ))}
              </ul>
            </article>
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

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded bg-coral/10 px-3 py-1 text-sm text-coral"><Sparkles size={16} /> Ce qu&apos;en disent les apprenants</p>
            <h2 className="mt-4 text-3xl font-semibold">Une progression motivante, pas une simple maquette</h2>
            <p className="mt-3 text-sage dark:text-mint">Les retours sont integres dans le produit : chaque partie peut devenir une analyse, chaque erreur peut revenir comme exercice, chaque point faible peut guider le prochain cours.</p>
          </div>
          <div className="grid gap-3">
            {testimonials.map(([name, quote]) => (
              <figure key={name} className="rounded border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                <blockquote className="text-sm text-sage dark:text-mint">&quot;{quote}&quot;</blockquote>
                <figcaption className="mt-3 font-semibold">{name}</figcaption>
              </figure>
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
        <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">Quel est votre niveau aux echecs ?</h2>
            <p className="mt-2 text-sage dark:text-mint">Commencez avec un cours, un defi tactique ou une partie d&apos;entrainement. Le tableau de bord indiquera ensuite les themes a revoir.</p>
          </div>
          <Link href="/practice" className="rounded bg-brass px-5 py-3 text-center font-medium text-white">Faire un test tactique</Link>
        </section>
        <section className="bg-ink px-4 py-12 text-paper dark:bg-paper dark:text-ink">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-3xl font-semibold">Pret a progresser ?</h2><p className="mt-2 opacity-80">Reprenez exactement ou vous vous etes arrete.</p></div>
            <Link href="/dashboard" className="rounded bg-coral px-5 py-3 font-medium text-white">Ouvrir le tableau de bord</Link>
          </div>
        </section>
      </main>
      <footer className="mx-auto grid max-w-7xl gap-4 px-4 py-8 text-sm text-sage md:grid-cols-[1fr_auto]">
        <div>
          <span className="font-semibold text-ink dark:text-paper">ChessMentor</span>
          <p className="mt-2 max-w-2xl">Cours d&apos;echecs, jouer aux echecs, defi tactique, tableau logique, progression et analyse. Interface en francais pour le moment.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/profile">Mon compte</Link>
          <Link href="/dashboard">Mes progres</Link>
          <Link href="/admin">Admin</Link>
          <span className="inline-flex items-center gap-2"><ShieldCheck size={16} /> Entrainement uniquement</span>
        </div>
      </footer>
    </AppShell>
  );
}
