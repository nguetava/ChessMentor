export function levelFromXp(xp: number) {
  if (xp >= 900) return 6;
  if (xp >= 600) return 5;
  if (xp >= 360) return 4;
  if (xp >= 180) return 3;
  if (xp >= 60) return 2;
  return 1;
}

export function nextLevelXp(xp: number) {
  const marks = [60, 180, 360, 600, 900, 1300];
  return marks.find((mark) => xp < mark) ?? 1300;
}

export function successRate(correct: number, total: number) {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

export function spacedRepetitionWeight(correct: boolean, attempts: number) {
  if (correct) return Math.max(1, 4 - attempts);
  return 8 + attempts * 2;
}
