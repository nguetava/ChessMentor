import { describe, expect, it } from "vitest";
import { displayStreak, nextStreak, percent } from "@/lib/stats";

const day = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("streak", () => {
  it("starts at 1 without history", () => {
    expect(nextStreak({ streak: 0, lastActiveOn: null }, day("2026-10-29")).streak).toBe(1);
  });

  it("keeps the streak within the same day", () => {
    expect(nextStreak({ streak: 4, lastActiveOn: day("2026-10-29") }, day("2026-10-29")).streak).toBe(4);
  });

  it("increments when the last activity was yesterday", () => {
    expect(nextStreak({ streak: 4, lastActiveOn: day("2026-10-28") }, day("2026-10-29")).streak).toBe(5);
  });

  it("resets after a gap", () => {
    expect(nextStreak({ streak: 9, lastActiveOn: day("2026-10-20") }, day("2026-10-29")).streak).toBe(1);
  });

  it("displays a broken streak as 0", () => {
    expect(displayStreak(5, day("2026-10-20"), day("2026-10-29"))).toBe(0);
    expect(displayStreak(5, day("2026-10-28"), day("2026-10-29"))).toBe(5);
  });

  it("computes percentages", () => {
    expect(percent(7, 10)).toBe(70);
    expect(percent(0, 0)).toBe(0);
  });
});

