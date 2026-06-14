import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Activity,
  ActivityStatus,
  Energy,
  Goal,
  IfThenPlan,
  Progress,
  Settings,
} from "../types";
import { todayKey } from "../lib/date";
import {
  POINTS_PER_ACTIVITY,
  POINTS_PER_STEP,
  computeBadges,
} from "../lib/gamification";

export const GOAL_COLORS = [
  "#5b8def",
  "#2dbd8b",
  "#e8915b",
  "#b06ddb",
  "#d8607a",
  "#3fb6c9",
];

function uid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export interface NewActivityInput {
  title: string;
  durationMin?: number;
  scheduledTime?: string;
  energy?: Energy;
  goalId?: string;
  note?: string;
  date?: string;
}

interface State {
  activities: Activity[];
  goals: Goal[];
  settings: Settings;
  progress: Progress;

  // Aktivitäten
  addActivity: (input: NewActivityInput) => void;
  updateActivity: (id: string, patch: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  setActivityStatus: (id: string, status: ActivityStatus) => void;
  reorderActivities: (date: string, orderedIds: string[]) => void;
  moveActivityToDate: (id: string, date: string) => void;

  // Ziele
  addGoal: (title: string, why?: string) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addStep: (goalId: string, text: string) => void;
  toggleStep: (goalId: string, stepId: string) => void;
  removeStep: (goalId: string, stepId: string) => void;
  addIfThen: (goalId: string, plan: Omit<IfThenPlan, "id">) => void;
  removeIfThen: (goalId: string, planId: string) => void;
  planStepToday: (goalId: string, stepId: string) => void;

  // Einstellungen & Daten
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
}

function awardForActivity(progress: Progress, delta: 1 | -1): Progress {
  const today = todayKey();
  const next: Progress = {
    ...progress,
    points: Math.max(0, progress.points + delta * POINTS_PER_ACTIVITY),
    totalActivitiesDone: Math.max(0, progress.totalActivitiesDone + delta),
  };
  if (delta === 1 && !next.completionDates.includes(today)) {
    next.completionDates = [...next.completionDates, today];
  }
  next.badges = computeBadges(next);
  return next;
}

const defaultSettings: Settings = {
  focusDurationMin: 25,
  breakMin: 5,
  reduceMotion: false,
};

const defaultProgress: Progress = {
  points: 0,
  completionDates: [],
  totalActivitiesDone: 0,
  totalStepsDone: 0,
  badges: [],
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      activities: [],
      goals: [],
      settings: defaultSettings,
      progress: defaultProgress,

      addActivity: (input) =>
        set((s) => {
          const date = input.date ?? todayKey();
          const maxOrder = s.activities
            .filter((a) => a.date === date)
            .reduce((m, a) => Math.max(m, a.order), -1);
          const activity: Activity = {
            id: uid(),
            title: input.title.trim(),
            note: input.note,
            durationMin: input.durationMin,
            scheduledTime: input.scheduledTime,
            energy: input.energy,
            goalId: input.goalId,
            status: "open",
            date,
            order: maxOrder + 1,
            createdAt: Date.now(),
          };
          return { activities: [...s.activities, activity] };
        }),

      updateActivity: (id, patch) =>
        set((s) => ({
          activities: s.activities.map((a) =>
            a.id === id ? { ...a, ...patch } : a,
          ),
        })),

      deleteActivity: (id) =>
        set((s) => ({
          activities: s.activities.filter((a) => a.id !== id),
        })),

      setActivityStatus: (id, status) =>
        set((s) => {
          const target = s.activities.find((a) => a.id === id);
          if (!target) return {};
          const wasDone = target.status === "done";
          const nowDone = status === "done";

          let progress = s.progress;
          if (!wasDone && nowDone) progress = awardForActivity(s.progress, 1);
          else if (wasDone && !nowDone)
            progress = awardForActivity(s.progress, -1);

          return {
            activities: s.activities.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status,
                    completedAt: nowDone ? Date.now() : undefined,
                  }
                : // Es kann immer nur eine Aktivität "active" sein (Fokus).
                  status === "active" && a.status === "active"
                  ? { ...a, status: "open" }
                  : a,
            ),
            progress,
          };
        }),

      reorderActivities: (date, orderedIds) =>
        set((s) => ({
          activities: s.activities.map((a) => {
            if (a.date !== date) return a;
            const idx = orderedIds.indexOf(a.id);
            return idx === -1 ? a : { ...a, order: idx };
          }),
        })),

      moveActivityToDate: (id, date) =>
        set((s) => ({
          activities: s.activities.map((a) =>
            a.id === id ? { ...a, date } : a,
          ),
        })),

      addGoal: (title, why) =>
        set((s) => ({
          goals: [
            ...s.goals,
            {
              id: uid(),
              title: title.trim(),
              why: why?.trim() || undefined,
              steps: [],
              ifThen: [],
              color: GOAL_COLORS[s.goals.length % GOAL_COLORS.length],
              archived: false,
              createdAt: Date.now(),
            },
          ],
        })),

      updateGoal: (id, patch) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),

      deleteGoal: (id) =>
        set((s) => ({
          goals: s.goals.filter((g) => g.id !== id),
          activities: s.activities.map((a) =>
            a.goalId === id ? { ...a, goalId: undefined } : a,
          ),
        })),

      addStep: (goalId, text) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  steps: [
                    ...g.steps,
                    { id: uid(), text: text.trim(), done: false },
                  ],
                }
              : g,
          ),
        })),

      toggleStep: (goalId, stepId) =>
        set((s) => {
          let delta = 0;
          const goals = s.goals.map((g) => {
            if (g.id !== goalId) return g;
            return {
              ...g,
              steps: g.steps.map((st) => {
                if (st.id !== stepId) return st;
                delta = st.done ? -1 : 1;
                return { ...st, done: !st.done };
              }),
            };
          });
          const progress: Progress = {
            ...s.progress,
            points: Math.max(0, s.progress.points + delta * POINTS_PER_STEP),
            totalStepsDone: Math.max(0, s.progress.totalStepsDone + delta),
          };
          progress.badges = computeBadges(progress);
          return { goals, progress };
        }),

      removeStep: (goalId, stepId) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? { ...g, steps: g.steps.filter((st) => st.id !== stepId) }
              : g,
          ),
        })),

      addIfThen: (goalId, plan) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? { ...g, ifThen: [...g.ifThen, { id: uid(), ...plan }] }
              : g,
          ),
        })),

      removeIfThen: (goalId, planId) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? { ...g, ifThen: g.ifThen.filter((p) => p.id !== planId) }
              : g,
          ),
        })),

      planStepToday: (goalId, stepId) =>
        set((s) => {
          const goal = s.goals.find((g) => g.id === goalId);
          const step = goal?.steps.find((st) => st.id === stepId);
          if (!goal || !step) return {};
          const date = todayKey();
          const maxOrder = s.activities
            .filter((a) => a.date === date)
            .reduce((m, a) => Math.max(m, a.order), -1);
          const activity: Activity = {
            id: uid(),
            title: step.text,
            goalId: goal.id,
            status: "open",
            date,
            order: maxOrder + 1,
            createdAt: Date.now(),
          };
          return { activities: [...s.activities, activity] };
        }),

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      resetAll: () =>
        set(() => ({
          activities: [],
          goals: [],
          progress: { ...defaultProgress },
        })),
    }),
    {
      name: "fokusplan-v1",
      version: 1,
    },
  ),
);
