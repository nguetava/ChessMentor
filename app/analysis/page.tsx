import { AppShell } from "@/components/AppShell";
import { analyzePgn } from "@/lib/chess";

export default function AnalysisPage({ searchParams }: { searchParams: { pgn?: string } }) {
  const report = analyzePgn(searchParams.pgn ? decodeURIComponent(searchParams.pgn) : "1. e4 e5 2. Nf3 Nc6");
  return (
    <AppShell>
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8">
        <h1 className="text-3xl font-semibold">Analyse apres partie</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded border p-4 dark:border-white/10"><p>Precision</p><strong className="text-3xl">{report.accuracy}%</strong></div>
          <div className="rounded border p-4 dark:border-white/10"><p>Erreurs</p><strong className="text-3xl">{report.mistakes}</strong></div>
          <div className="rounded border p-4 dark:border-white/10"><p>Grosses erreurs</p><strong className="text-3xl">{report.blunders}</strong></div>
        </div>
        <p className="rounded bg-black/5 p-4 dark:bg-white/10">{report.summary}</p>
        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">Moments cles</h2>
          {report.keyMoments.map((moment, index) => (
            <article key={index} className="rounded border p-4 dark:border-white/10">
              <strong>{moment.move}</strong>
              <p className="mt-2">{moment.why}</p>
              <p className="mt-2 text-sm text-sage">Meilleur plan : {moment.better}</p>
              <p className="mt-2 text-sm">A retenir : {moment.lesson}</p>
            </article>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
