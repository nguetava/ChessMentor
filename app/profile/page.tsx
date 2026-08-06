import { AppShell } from "@/components/AppShell";
import { demoStats } from "@/lib/demo";
import { getCurrentUser } from "@/lib/auth";

const levelLabels: Record<string, string> = {
  NO_RULES: "Je ne connais pas les regles",
  BEGINNER: "Debutant",
  INTERMEDIATE: "Intermediaire",
  ADVANCED: "Avance"
};

const localeLabels: Record<string, string> = {
  fr: "Francais",
  de: "Deutsch",
  en: "English"
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const profile = user?.profile;
  const stats = user?.statistics;
  const displayName = profile?.displayName ?? user?.email ?? "Invite";
  const initials = displayName.slice(0, 2).toUpperCase();
  const locale = localeLabels[profile?.locale ?? "fr"] ?? "Francais";
  const level = levelLabels[profile?.chessLevel ?? "NO_RULES"] ?? demoStats.level;

  return (
    <AppShell>
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8">
        <h1 className="text-3xl font-semibold">Profil</h1>
        <section className="rounded border p-5 dark:border-white/10">
          <div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded bg-coral text-xl text-white">{initials}</div><div><h2 className="text-xl font-semibold">{displayName}</h2><p className="text-sage">Langue : {locale} | Niveau : {level}</p>{user?.email && <p className="text-sm text-sage">{user.email}</p>}</div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3"><span>XP : {stats?.xp ?? demoStats.xp}</span><span>Parties : {stats?.gamesPlayed ?? demoStats.games}</span><span>Temps total : {profile?.totalLearningMin ?? 0} min</span></div>
        </section>
        <section className="rounded border p-5 dark:border-white/10">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="rounded border p-3 text-ink" defaultValue={displayName} aria-label="Nom" />
            <select className="rounded border p-3 text-ink" defaultValue={locale} aria-label="Langue"><option>Francais</option><option>Deutsch</option><option>English</option></select>
            <select className="rounded border p-3 text-ink" defaultValue={profile?.coachMode ?? "guided"} aria-label="Type de conseils"><option value="guided">Assistance guidee</option><option value="light">Legere</option><option value="complete">Complete</option></select>
            <select className="rounded border p-3 text-ink" aria-label="Notifications"><option>Notifications discretes</option><option>Desactivees</option></select>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
