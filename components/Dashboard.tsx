"use client";

import Link from "next/link";
import { Award, Flame, PlayCircle, Target, Trophy } from "lucide-react";
import type { DashboardStats } from "@/lib/dashboard";

export function Dashboard({ stats, demo = false }: { stats: DashboardStats; demo?: boolean }) {
  const cards = [
    ["XP", stats.xp, Trophy],
    ["Serie quotidienne", `${stats.streak} jours`, Flame],
    ["Lecons terminees", stats.lessons, PlayCircle],
    ["Victoires", stats.games ? `${stats.winRate}% (${stats.games} parties)` : "Aucune partie", Target]
  ] as const;

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
      <aside className="rounded border border-black/10 p-4 dark:border-white/10">
        <p className="text-sm text-sage">Niveau actuel</p>
        <h1 className="text-2xl font-semibold">{stats.level}</h1>
        <div className="mt-4 h-3 rounded bg-black/10 dark:bg-white/10"><div className="h-3 rounded bg-coral" style={{ width: `${stats.progress}%` }} /></div>
        <Link href="/learn" className="mt-5 flex items-center justify-center gap-2 rounded bg-ink px-4 py-3 text-white dark:bg-coral">
          <PlayCircle size={18} /> Reprendre
        </Link>
      </aside>
      <section className="grid gap-6">
        {demo && <p role="status" className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">Données d'exemple : connectez-vous pour suivre votre vraie progression.</p>}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value, Icon]) => (
            <article key={label} className="rounded border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <Icon size={20} className="text-coral" />
              <p className="mt-3 text-sm text-sage">{label}</p>
              <strong className="text-2xl">{value}</strong>
            </article>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded border border-black/10 p-5 dark:border-white/10">
            <h2 className="text-xl font-semibold">Recommandations</h2>
            <ul className="mt-3 grid gap-2 text-sm">
              {demo ? (
                <>
                  <li>Revoir : Comment reconnaitre un echec et mat ?</li>
                  <li>Exercice a reprendre : fourchette</li>
                  <li>Objectif du jour : 40 XP</li>
                </>
              ) : (
                <>
                  {stats.weaknesses.slice(0, 2).map((weakness) => (
                    <li key={weakness.theme}>Revoir : {weakness.lesson} ({weakness.theme})</li>
                  ))}
                  {stats.weaknesses.length === 0 && <li>Terminez une leçon ou un exercice pour recevoir des recommandations personnalisées.</li>}
                  <li>Objectif du jour : 40 XP</li>
                </>
              )}
            </ul>
          </section>
          <section className="rounded border border-black/10 p-5 dark:border-white/10">
            <h2 className="text-xl font-semibold">Badges debloques</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {stats.badges.map((badge) => <span key={badge} className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm"><Award size={16} />{badge}</span>)}
            </div>
          </section>
        </div>
        <section className="rounded border border-black/10 p-5 dark:border-white/10">
          <h2 className="text-xl font-semibold">Mes points faibles</h2>
          <div className="mt-3 grid gap-2">
            {stats.weaknesses.map((weakness) => (
              <div key={weakness.theme} className="grid gap-2 rounded bg-black/5 p-3 text-sm dark:bg-white/10 sm:grid-cols-4">
                <strong>{weakness.theme}</strong><span>{weakness.successRate}%</span><span>{weakness.mistakes} erreurs</span><span>{weakness.lesson}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
