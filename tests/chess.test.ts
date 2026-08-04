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
});

describe("progression", () => {
  it("maps xp to levels and success rates", () => {
    expect(levelFromXp(200)).toBe(3);
    expect(successRate(7, 10)).toBe(70);
    expect(spacedRepetitionWeight(false, 2)).toBeGreaterThan(spacedRepetitionWeight(true, 2));
  });
});
