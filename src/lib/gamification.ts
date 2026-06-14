import type { Progress } from "../types";
import { todayKey, addDays } from "./date";

export const POINTS_PER_ACTIVITY = 10;
export const POINTS_PER_STEP = 5;

/**
 * Berechnet den aktuellen "Streak" – aufeinanderfolgende aktive Tage, die
 * heute oder gestern enden. Bewusst schamfrei: eine Lücke setzt nur den
 * Zähler zurück, ohne den Menschen abzuwerten.
 */
export function currentStreak(completionDates: string[]): number {
  const set = new Set(completionDates);
  const today = todayKey();
  const yesterday = addDays(today, -1);

  // Kein aktiver Tag heute oder gestern => kein laufender Streak.
  let cursor: string;
  if (set.has(today)) cursor = today;
  else if (set.has(yesterday)) cursor = yesterday;
  else return 0;

  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Anzahl aktiver Tage in den letzten 7 Tagen (inkl. heute). */
export function activeDaysThisWeek(completionDates: string[]): number {
  const set = new Set(completionDates);
  let count = 0;
  for (let i = 0; i < 7; i++) {
    if (set.has(addDays(todayKey(), -i))) count += 1;
  }
  return count;
}

export interface BadgeDef {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earned: (p: Progress) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: "first-step",
    emoji: "🌱",
    title: "Erster Schritt",
    description: "Die erste Aktivität erledigt.",
    earned: (p) => p.totalActivitiesDone >= 1,
  },
  {
    id: "ten-done",
    emoji: "⭐",
    title: "Auf Kurs",
    description: "10 Aktivitäten erledigt.",
    earned: (p) => p.totalActivitiesDone >= 10,
  },
  {
    id: "fifty-done",
    emoji: "🚀",
    title: "Im Flow",
    description: "50 Aktivitäten erledigt.",
    earned: (p) => p.totalActivitiesDone >= 50,
  },
  {
    id: "streak-3",
    emoji: "🔥",
    title: "Dranbleiber",
    description: "3 Tage in Folge aktiv.",
    earned: (p) => currentStreak(p.completionDates) >= 3,
  },
  {
    id: "steps-master",
    emoji: "🧭",
    title: "Schritt für Schritt",
    description: "10 Ziel-Schritte abgehakt.",
    earned: (p) => p.totalStepsDone >= 10,
  },
];

/** Liefert die IDs aller aktuell verdienten Badges. */
export function computeBadges(p: Progress): string[] {
  return BADGES.filter((b) => b.earned(p)).map((b) => b.id);
}
