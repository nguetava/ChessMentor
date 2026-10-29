import { levelFromXp, nextLevelXp } from "@/lib/progression";
import { displayStreak, percent } from "@/lib/stats";
import { demoStats } from "@/lib/demo";

export type DashboardStats = {
  level: string;
  xp: number;
  progress: number;
  streak: number;
  lessons: number;
  exercises: number;
  winRate: number;
  games: number;
  badges: string[];
  weaknesses: { theme: string; successRate: number; mistakes: number; lesson: string; exercise: string }[];
};

const marks = [0, 60, 180, 360, 600, 900, 1300];

export function demoDashboard(): DashboardStats {
  return {
    level: demoStats.level,
    xp: demoStats.xp,
    progress: demoStats.progress,
    streak: demoStats.streak,
    lessons: demoStats.lessons,
    exercises: demoStats.exercises,
    winRate: percent(demoStats.wins, demoStats.games),
    games: demoStats.games,
    badges: demoStats.badges,
    weaknesses: demoStats.weaknesses
  };
}

type RealInput = {
  statistics: {
    xp: number;
    streak: number;
    lastActiveOn: Date | null;
    lessonsCompleted: number;
    exercisesSolved: number;
    gamesPlayed: number;
    wins: number;
  } | null;
  badges: string[];
  weaknesses: DashboardStats["weaknesses"];
};

/** Statistiques réelles d'un utilisateur connecté (aucune donnée de démonstration). */
export function realDashboard({ statistics, badges, weaknesses }: RealInput): DashboardStats {
  const xp = statistics?.xp ?? 0;
  const level = levelFromXp(xp);
  const floor = marks[level - 1] ?? 0;
  const ceil = nextLevelXp(xp);
  return {
    level: `Niveau ${level}`,
    xp,
    progress: Math.min(100, Math.round(((xp - floor) / Math.max(1, ceil - floor)) * 100)),
    streak: displayStreak(statistics?.streak ?? 0, statistics?.lastActiveOn ?? null),
    lessons: statistics?.lessonsCompleted ?? 0,
    exercises: statistics?.exercisesSolved ?? 0,
    winRate: percent(statistics?.wins ?? 0, statistics?.gamesPlayed ?? 0),
    games: statistics?.gamesPlayed ?? 0,
    badges,
    weaknesses
  };
}

