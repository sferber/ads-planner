export type ActivityStatus = "open" | "active" | "done";
export type Energy = "low" | "medium" | "high";

export interface Activity {
  id: string;
  title: string;
  note?: string;
  /** Geschätzte Dauer in Minuten – macht Zeit sichtbar (Zeitblindheit). */
  durationMin?: number;
  /** Optionale feste Uhrzeit als Anker, Format "HH:MM". */
  scheduledTime?: string;
  status: ActivityStatus;
  /** Tag, zu dem die Aktivität gehört, Format "YYYY-MM-DD". */
  date: string;
  goalId?: string;
  /** Benötigtes Energielevel – hilft beim realistischen Planen. */
  energy?: Energy;
  order: number;
  createdAt: number;
  completedAt?: number;
}

export interface GoalStep {
  id: string;
  text: string;
  done: boolean;
}

export interface IfThenPlan {
  id: string;
  ifText: string;
  thenText: string;
}

export interface Goal {
  id: string;
  title: string;
  /** Das "Warum" – verankert die Motivation. */
  why?: string;
  steps: GoalStep[];
  ifThen: IfThenPlan[];
  color: string;
  archived: boolean;
  createdAt: number;
}

export interface Settings {
  focusDurationMin: number;
  breakMin: number;
  reduceMotion: boolean;
  name?: string;
}

export interface Progress {
  points: number;
  /** Tage (YYYY-MM-DD) mit mindestens einer erledigten Aktivität. */
  completionDates: string[];
  totalActivitiesDone: number;
  totalStepsDone: number;
  badges: string[];
}
