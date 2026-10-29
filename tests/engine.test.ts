import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { buildReport, classifyLoss, moveAccuracy, winPercent } from "@/lib/engine/analysis";
import type { EngineEval } from "@/lib/engine/uci";

describe("engine analysis", () => {
  it("maps centipawns to win probability", () => {
    expect(winPercent(0)).toBeCloseTo(50, 5);
    expect(winPercent(500)).toBeGreaterThan(80);
    expect(winPercent(-500)).toBeLessThan(20);
  });

  it("scores accuracy and classifies losses", () => {
    expect(moveAccuracy(0)).toBeGreaterThan(99);
    expect(moveAccuracy(40)).toBeLessThan(30);
    expect(classifyLoss(35, false)).toBe("blunder");
    expect(classifyLoss(22, false)).toBe("mistake");
    expect(classifyLoss(12, false)).toBe("inaccuracy");
    expect(classifyLoss(1, false)).toBe("excellent");
    expect(classifyLoss(5, false)).toBe("good");
    expect(classifyLoss(50, true)).toBe("best");
  });

  it("builds a report that flags a blunder as a key moment", () => {
    const pgn = "1. e4 e5 2. Qh5 Nc6";
    const evals: EngineEval[] = [
      { cp: 20, mate: null, best: "e2e4" },
      { cp: 20, mate: null, best: "e7e5" },
      { cp: 25, mate: null, best: "g1f3" },
      { cp: -400, mate: null, best: "b8c6" },
      { cp: -380, mate: null, best: "a2a3" }
    ];
    const report = buildReport(pgn, evals);
    expect(report).not.toBeNull();
    expect(report!.moves).toHaveLength(4);
    expect(report!.moves[2].classification).toBe("blunder");
    expect(report!.keyMoments[0].san).toBe("Qh5");
    expect(report!.keyMoments[0].better).toContain("Nf3");
    expect(report!.white.accuracy).toBeLessThan(report!.black.accuracy);
  });

  it("rejects mismatched evaluations", () => {
    expect(buildReport("1. e4 e5", [{ cp: 0, mate: null, best: "" }])).toBeNull();
    expect(new Chess().history()).toHaveLength(0);
  });
});
