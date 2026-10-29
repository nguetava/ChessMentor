import { AppShell } from "@/components/AppShell";
import { AnalysisReport } from "@/components/AnalysisReport";

export default function AnalysisPage({ searchParams }: { searchParams: { pgn?: string } }) {
  const raw = searchParams.pgn ?? "";
  let pgn = "1. e4 e5 2. Nf3 Nc6";
  try {
    if (raw) pgn = decodeURIComponent(raw).slice(0, 20000);
  } catch {
    // PGN mal encodé : on garde la partie d'exemple.
  }
  return (
    <AppShell>
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8">
        <h1 className="text-3xl font-semibold">Analyse après partie</h1>
        <AnalysisReport initialPgn={pgn} />
      </main>
    </AppShell>
  );
}
