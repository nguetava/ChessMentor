import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { chooseComputerMove, coachHints } from "@/lib/chess";
import { levelFromXp, spacedRepetitionWeight, successRate } from "@/lib/progression";
import { courses, exercises } from "@/data/content";

const startFen = new Chess().fen();

describe("chess helpers", () => {
  it("chooses a legal computer move", () => {
    expect(chooseComputerMove(startFen, "easy")?.san).toBeTruthy();
  });

  it("creates coach hints", () => {
    expect(coachHints(startFen).candidates.length).toBeGreaterThan(0);
  });
});

describe("learning content", () => {
  it("has legal first moves for every tactic exercise", () => {
    for (const exercise of exercises) {
      const chess = new Chess(exercise.fen);
      expect(chess.moves(), exercise.slug).toContain(exercise.solution[0]);
    }
  });

  it("has legal first moves for lesson exercises", () => {
    const lessons = courses.flatMap((course) => course.modules.flatMap((module) => module.lessons));
    for (const lesson of lessons) {
      const chess = new Chess(lesson.content.exercise.fen);
      expect(chess.moves(), lesson.slug).toContain(lesson.content.exercise.solution[0]);
    }
  });

  it("has a complete progressive course catalog", () => {
    const lessons = courses.flatMap((course) => course.modules.flatMap((module) => module.lessons));
    expect(courses).toHaveLength(3);
    expect(lessons).toHaveLength(46);

    for (const lesson of lessons) {
      expect(lesson.content.moves.length, lesson.slug).toBeGreaterThan(0);
      expect(lesson.content.checklist.length, lesson.slug).toBeGreaterThanOrEqual(5);
      expect(lesson.content.mastery.length, lesson.slug).toBeGreaterThanOrEqual(4);
      expect(lesson.content.method.fr.length, lesson.slug).toBeGreaterThan(80);
      expect(lesson.content.training.prompt.fr.length, lesson.slug).toBeGreaterThan(60);
      expect(lesson.content.summary.fr.length, lesson.slug).toBeGreaterThan(120);
    }
  });
});

describe("progression", () => {
  it("maps xp to levels and success rates", () => {
    expect(levelFromXp(200)).toBe(3);
    expect(successRate(7, 10)).toBe(70);
    expect(spacedRepetitionWeight(false, 2)).toBeGreaterThan(spacedRepetitionWeight(true, 2));
  });
});
