import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { analyzePgn } from "@/lib/chess";
import { prisma } from "@/lib/prisma";
import { gameSaveSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = gameSaveSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Partie invalide." }, { status: 400 });
  const user = await getCurrentUser();
  const analysis = analyzePgn(parsed.data.pgn);
  if (!user) return NextResponse.json({ id: "local", analysis });
  const game = await prisma.game.create({
    data: {
      userId: user.id,
      pgn: parsed.data.pgn,
      result: parsed.data.result,
      color: parsed.data.color,
      difficulty: parsed.data.difficulty,
      trainingMode: parsed.data.trainingMode,
      endedAt: new Date(),
      moves: { create: parsed.data.moves.map((move) => ({ ply: move.ply, san: move.san, fen: move.fen })) },
      analysis: { create: { summary: analysis as never, accuracy: analysis.accuracy, mistakes: analysis.mistakes, blunders: analysis.blunders, keyMoments: analysis.keyMoments as never } }
    }
  });
  await prisma.userStatistics.upsert({
    where: { userId: user.id },
    update: { gamesPlayed: { increment: 1 } },
    create: { userId: user.id, gamesPlayed: 1 }
  });
  return NextResponse.json({ id: game.id, analysis });
}
