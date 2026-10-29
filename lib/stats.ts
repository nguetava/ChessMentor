/** Jour calendaire UTC (AAAA-MM-JJ). */
function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Calcule la nouvelle série quotidienne : inchangée si déjà active aujourd'hui,
 * +1 si la dernière activité date d'hier, sinon on repart à 1.
 */
export function nextStreak(current: { streak: number; lastActiveOn: Date | null }, now: Date = new Date()) {
  const today = dayKey(now);
  if (!current.lastActiveOn) return { streak: 1, lastActiveOn: now };
  const last = dayKey(current.lastActiveOn);
  if (last === today) return { streak: Math.max(1, current.streak), lastActiveOn: current.lastActiveOn };
  const yesterday = dayKey(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  if (last === yesterday) return { streak: current.streak + 1, lastActiveOn: now };
  return { streak: 1, lastActiveOn: now };
}

/** Série affichée : une série dont la dernière activité remonte à plus d'un jour est considérée comme rompue. */
export function displayStreak(streak: number, lastActiveOn: Date | null, now: Date = new Date()) {
  if (!lastActiveOn) return 0;
  const last = dayKey(lastActiveOn);
  const yesterday = dayKey(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  return last === dayKey(now) || last === yesterday ? streak : 0;
}

/** Taux de réussite global : exercices réussis / tentatives. */
export function percent(correct: number, total: number) {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

