import { AppShell } from "@/components/AppShell";
import { Dashboard } from "@/components/Dashboard";
import { getCurrentUser } from "@/lib/auth";
import { demoDashboard, realDashboard } from "@/lib/dashboard";
import { pick } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <AppShell>
        <Dashboard stats={demoDashboard()} demo />
      </AppShell>
    );
  }

  const weaknesses = await prisma.userWeakness
    .findMany({ where: { userId: user.id }, orderBy: { successRate: "asc" }, take: 5 })
    .catch(() => []);
  const stats = realDashboard({
    statistics: user.statistics,
    badges: user.badges.map((entry) => pick(entry.badge.title as never)),
    weaknesses: weaknesses.map((weakness) => ({
      theme: weakness.theme,
      successRate: weakness.successRate,
      mistakes: weakness.mistakes,
      lesson: weakness.recommendedLesson,
      exercise: weakness.recommendedExercise
    }))
  });
  return (
    <AppShell>
      <Dashboard stats={stats} />
    </AppShell>
  );
}
