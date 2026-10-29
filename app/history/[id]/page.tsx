import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GameReplay } from "@/components/GameReplay";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GameDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) notFound();
  const game = await prisma.game.findFirst({
    where: { id: params.id, userId: user.id },
    include: { moves: { orderBy: { ply: "asc" }, select: { ply: true, san: true, fen: true } } }
  });
  if (!game) notFound();

  return (
    <AppShell>
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">Rejouer la partie</h1>
          <div className="flex gap-3 text-sm">
            <Link href="/history" className="underline">Retour à l'historique</Link>
            <Link href={`/analysis?pgn=${encodeURIComponent(game.pgn)}`} className="underline">Analyser avec Stockfish</Link>
          </div>
        </div>
        <GameReplay moves={game.moves} orientation={game.color === "black" ? "black" : "white"} />
      </main>
    </AppShell>
  );
}

