import { NextResponse } from "next/server";
import { Chess } from "chess.js";
import { getCurrentUser } from "@/lib/auth";
import { analyzePgn } from "@/lib/chess";
import { limited, parseBody } from "@/lib/http";
import { nextStreak } from "@/lib/stats";
import { prisma } from "@/lib/prisma";
import { gameSaveSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const blocked = limited(request, "games", 30, 60 * 1000);
  if (blocked) return blocked;
  const body = await parseBody(request, gameSaveSchema, "Partie invalide.");
  if (body.error) return body.error;

  // Rejoue le PGN côté serveur : coups et résultat sont déduits, jamais pris du client.
  const replay = new Chess();
  try {
    replay.loadPgn(body.data.pgn);
  } catch {
    return NextResponse.json({ error: "Partie invalide." }, { status: 400 });
  }
  const history = replay.history({ verbose: true });
  if (history.length === 0 || history.length > 600) return NextResponse.json({ error: "Partie invalide." }, { status: 400 });
  const result = replay.isCheckmate()
    ? replay.turn() === "w" ? "BLACK_WIN" : "WHITE_WIN"
    : replay.isDraw() || replay.isStalemate() ? "DRAW" : "ONGOING";
  const moves = history.map((move, index) => ({ ply: index + 1, san: move.san, fen: move.after }));

  const user = await getCurrentUser();
  const analysis = analyzePgn(body.data.pgn);
  if (!user) return NextResponse.json({ id: "local", analysis });

  try {
    const current = await prisma.userStatistics.findUnique({ where: { userId: user.id } });
    const streak = nextStreak({ streak: current?.streak ?? 0, lastActiveOn: current?.lastActiveOn ?? null });
    const [game] = await prisma.$transaction([
      prisma.game.create({
        data: {
          userId: user.id,
          pgn: replay.pgn(),
          result,
          color: body.data.color,
          difficulty: body.data.difficulty,
          trainingMode: body.data.trainingMode,
          endedAt: new Date(),
          moves: { create: moves },
          analysis: { create: { summary: analysis as never, accuracy: analysis.accuracy, mistakes: analysis.mistakes, blunders: analysis.blunders, keyMoments: analysis.keyMoments as never } }
        }
      }),
      prisma.userStatistics.upsert({
        where: { userId: user.id },
        update: {
          gamesPlayed: { increment: 1 },
          streak: streak.streak,
          lastActiveOn: streak.lastActiveOn,
          ...(result === "ONGOING" ? {} : outcomeIncrement(result, body.data.color))
        },
        create: { userId: user.id, gamesPlayed: 1, streak: streak.streak, lastActiveOn: streak.lastActiveOn, ...(result === "ONGOING" ? {} : outcomeCreate(result, body.data.color)) }
      })
    ]);
    return NextResponse.json({ id: game.id, analysis });
  } catch (error) {
    console.error("[games]", error);
    return NextResponse.json({ error: "Sauvegarde indisponible." }, { status: 503 });
  }
}

function outcome(result: string, color: string) {
  if (result === "DRAW") return "draws";
  const userWon = (result === "WHITE_WIN") === (color === "white");
  return userWon ? "wins" : "losses";
}
function outcomeIncrement(result: string, color: string) {
  return { [outcome(result, color)]: { increment: 1 } };
}
function outcomeCreate(result: string, color: string) {
  return { [outcome(result, color)]: 1 };
}
