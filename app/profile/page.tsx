import { AppShell } from "@/components/AppShell";
import { demoStats } from "@/lib/demo";

export default function ProfilePage() {
  return (
    <AppShell>
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8">
        <h1 className="text-3xl font-semibold">Profil</h1>
        <section className="rounded border p-5 dark:border-white/10">
          <div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded bg-coral text-xl text-white">CM</div><div><h2 className="text-xl font-semibold">Joueur demo</h2><p className="text-sage">Langue : francais | Niveau : {demoStats.level}</p></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3"><span>XP : {demoStats.xp}</span><span>Parties : {demoStats.games}</span><span>Temps total : 3 h 20</span></div>
        </section>
        <section className="rounded border p-5 dark:border-white/10">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="rounded border p-3 text-ink" defaultValue="Joueur demo" aria-label="Nom" />
            <select className="rounded border p-3 text-ink" aria-label="Langue"><option>Francais</option><option>Deutsch</option><option>English</option></select>
            <select className="rounded border p-3 text-ink" aria-label="Type de conseils"><option>Assistance guidee</option><option>Legere</option><option>Complete</option></select>
            <select className="rounded border p-3 text-ink" aria-label="Notifications"><option>Notifications discretes</option><option>Desactivees</option></select>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
