import { NextResponse } from "next/server";
import { courses, exercises } from "@/data/content";
import { getCurrentUser } from "@/lib/auth";
import { limited, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { nextStreak } from "@/lib/stats";
import { progressSchema } from "@/lib/validation";

const lessonSlugs = new Set(courses.flatMap((course) => course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.slug))));
const exerciseSlugs = new Set(exercises.map((exercise) => exercise.slug));

export async function POST(request: Request) {
  const blocked = limited(request, "progress", 60, 60 * 1000);
  if (blocked) return blocked;
  const body = await parseBody(request, progressSchema, "Progression invalide.");
  if (body.error) return body.error;
  const payload = body.data;
  const known = payload.type === "lesson" ? lessonSlugs.has(payload.slug) : exerciseSlugs.has(payload.slug);
  if (!known) return NextResponse.json({ error: "Contenu inconnu." }, { status: 400 });

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: true, local: true });
  const solved = payload.type === "exercise" && payload.correct;
  const xp = payload.type === "lesson" ? 25 : solved ? 15 : 0;
  const current = await prisma.userStatistics.findUnique({ where: { userId: user.id } });
  const streak = nextStreak({ streak: current?.streak ?? 0, lastActiveOn: current?.lastActiveOn ?? null });
  await prisma.userStatistics.upsert({
    where: { userId: user.id },
    update: { xp: { increment: xp }, exercisesSolved: solved ? { increment: 1 } : undefined, streak: streak.streak, lastActiveOn: streak.lastActiveOn },
    create: { userId: user.id, xp, exercisesSolved: solved ? 1 : 0, streak: streak.streak, lastActiveOn: streak.lastActiveOn }
  });
  return NextResponse.json({ ok: true, xp });
}
