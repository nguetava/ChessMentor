import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const resultLabel: Record<string, string> = {
  WHITE_WIN: "Victoire des Blancs",
  BLACK_WIN: "Victoire des Noirs",
  DRAW: "Nulle",
  ONGOING: "Inachevée"
};

export default async function HistoryPage() {
  const user = await getCurrentUser();
  const games = user
    ? await prisma.game.findMany({
        where: { userId: user.id },
        orderBy: { startedAt: "desc" },
        take: 50,
        select: { id: true, startedAt: true, result: true, color: true, difficulty: true, _count: { select: { moves: true } } }
      })
    : [];

  return (
    <AppShell>
      <main className="mx-auto grid max-w-4xl gap-6 px-4 py-8">
        <h1 className="text-3xl font-semibold">Historique des parties</h1>
        {!user && (
          <p className="rounded border p-4 dark:border-white/10">
            <Link href="/#auth" className="underline">Connectez-vous</Link> pour retrouver vos parties.
          </p>
        )}
        {user && games.length === 0 && (
          <p className="rounded border p-4 dark:border-white/10">
            Aucune partie enregistrée. <Link href="/play" className="underline">Jouer une partie</Link>
          </p>
        )}
        <ul className="grid gap-3">
          {games.map((game) => (
            <li key={game.id}>
              <Link href={`/history/${game.id}`} className="grid gap-1 rounded border p-4 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10 sm:grid-cols-4">
                <strong>{game.startedAt.toLocaleDateString("fr-FR")}</strong>
                <span>{resultLabel[game.result] ?? game.result}</span>
                <span>Vous : {game.color === "black" ? "Noirs" : "Blancs"} · {game.difficulty}</span>
                <span>{Math.ceil(game._count.moves / 2)} coups</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </AppShell>
  );
}

