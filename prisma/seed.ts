import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { badges, courses, exercises } from "../data/content";

const prisma = new PrismaClient();

async function main() {
  for (const course of courses) {
    const savedCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        level: course.level,
        title: course.title,
        description: course.description
      },
      create: {
        slug: course.slug,
        level: course.level,
        title: course.title,
        description: course.description,
        modules: {
          create: course.modules.map((module, moduleIndex) => ({
            order: moduleIndex + 1,
            title: module.title,
            lessons: {
              create: module.lessons.map((lesson, lessonIndex) => ({
                slug: lesson.slug,
                order: lessonIndex + 1,
                title: lesson.title,
                objective: lesson.objective,
                content: lesson.content,
                xpReward: lesson.xpReward
              }))
            }
          }))
        }
      }
    });

    for (const [moduleIndex, module] of course.modules.entries()) {
      const existingModule = await prisma.module.findFirst({
        where: { courseId: savedCourse.id, order: moduleIndex + 1 }
      });
      const savedModule = existingModule
        ? await prisma.module.update({
            where: { id: existingModule.id },
            data: { title: module.title, order: moduleIndex + 1 }
          })
        : await prisma.module.create({
            data: { courseId: savedCourse.id, order: moduleIndex + 1, title: module.title }
          });

      for (const [lessonIndex, lesson] of module.lessons.entries()) {
        await prisma.lesson.upsert({
          where: { slug: lesson.slug },
          update: {
            moduleId: savedModule.id,
            order: lessonIndex + 1,
            title: lesson.title,
            objective: lesson.objective,
            content: lesson.content,
            xpReward: lesson.xpReward
          },
          create: {
            moduleId: savedModule.id,
            slug: lesson.slug,
            order: lessonIndex + 1,
            title: lesson.title,
            objective: lesson.objective,
            content: lesson.content,
            xpReward: lesson.xpReward
          }
        });
      }
    }
  }

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      update: {
        theme: exercise.theme,
        difficulty: exercise.difficulty,
        fen: exercise.fen,
        sideToMove: exercise.sideToMove,
        solution: exercise.solution,
        explanation: exercise.explanation
      },
      create: {
        slug: exercise.slug,
        theme: exercise.theme,
        difficulty: exercise.difficulty,
        fen: exercise.fen,
        sideToMove: exercise.sideToMove,
        solution: exercise.solution,
        explanation: exercise.explanation
      }
    });
  }

  for (const badge of badges) {
    await prisma.badge.upsert({ where: { code: badge.code }, update: badge, create: badge });
  }

  await prisma.user.upsert({
    where: { email: "demo@chessmentor.local" },
    update: {},
    create: {
      email: "demo@chessmentor.local",
      passwordHash: await bcrypt.hash("ChessMentor123!", 12),
      emailVerified: new Date(),
      profile: { create: { displayName: "Joueur demo", locale: "fr", chessLevel: "BEGINNER" } },
      statistics: { create: { xp: 145, streak: 4, lessonsCompleted: 2, exercisesSolved: 7, gamesPlayed: 5, wins: 2, losses: 2, draws: 1, successRate: 70 } },
      weaknesses: {
        create: [
          { theme: "Fourchettes", successRate: 42, mistakes: 5, recommendedLesson: "Tactiques niveau 3", recommendedExercise: "fork-1" },
          { theme: "Roi en securite", successRate: 55, mistakes: 3, recommendedLesson: "Importance du roque", recommendedExercise: "defense-1" }
        ]
      }
    }
  });
}

main().finally(async () => prisma.$disconnect());
