import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { chooseComputerMove, coachHints } from "@/lib/chess";
import { levelFromXp, spacedRepetitionWeight, successRate } from "@/lib/progression";

const startFen = new Chess().fen();

describe("chess helpers", () => {
  it("chooses a legal computer move", () => {
    expect(chooseComputerMove(startFen, "easy")?.san).toBeTruthy();
  });

  it("creates coach hints", () => {
    expect(coachHints(startFen).candidates.length).toBeGreaterThan(0);
  });
});

describe("progression", () => {
  it("maps xp to levels and success rates", () => {
    expect(levelFromXp(200)).toBe(3);
    expect(successRate(7, 10)).toBe(70);
    expect(spacedRepetitionWeight(false, 2)).toBeGreaterThan(spacedRepetitionWeight(true, 2));
  });
});
