import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const payload = await request.json();
  if (!user) return NextResponse.json({ ok: true, local: true });
  const xp = payload.type === "lesson" ? 25 : payload.correct ? 15 : 0;
  await prisma.userStatistics.upsert({
    where: { userId: user.id },
    update: { xp: { increment: xp }, exercisesSolved: payload.type === "exercise" && payload.correct ? { increment: 1 } : undefined },
    create: { userId: user.id, xp, exercisesSolved: payload.type === "exercise" && payload.correct ? 1 : 0 }
  });
  return NextResponse.json({ ok: true, xp });
}
