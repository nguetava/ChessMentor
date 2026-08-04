import { AppShell } from "@/components/AppShell";
import { courses, exercises } from "@/data/content";

export default function AdminPage() {
  return (
    <AppShell>
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
        <h1 className="text-3xl font-semibold">Administration</h1>
        <section className="grid gap-3 rounded border p-5 dark:border-white/10">
          <h2 className="text-xl font-semibold">Contenu</h2>
          <input className="rounded border p-3 text-ink" placeholder="Ajouter un cours" />
          <input className="rounded border p-3 text-ink" placeholder="Importer une position FEN" />
          <textarea className="rounded border p-3 text-ink" placeholder="Solution et traductions" />
          <button className="rounded bg-ink px-4 py-3 text-white">Enregistrer le brouillon</button>
        </section>
        <section className="rounded border p-5 dark:border-white/10">
          <p>{courses.length} cours, {exercises.length} exercices tactiques, statistiques globales pretes pour PostgreSQL.</p>
        </section>
      </main>
    </AppShell>
  );
}
