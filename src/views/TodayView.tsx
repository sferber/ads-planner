import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useStore } from "../store/useStore";
import SortableActivity from "../components/SortableActivity";
import AddActivityForm from "../components/AddActivityForm";
import {
  addDays,
  formatDuration,
  relativeDayLabel,
  todayKey,
} from "../lib/date";

interface Props {
  onStartFocus: (activityId?: string) => void;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Gute Nacht";
  if (h < 11) return "Guten Morgen";
  if (h < 17) return "Hallo";
  return "Guten Abend";
}

export default function TodayView({ onStartFocus }: Props) {
  const [date, setDate] = useState(todayKey());
  const activities = useStore((s) => s.activities);
  const goals = useStore((s) => s.goals);
  const name = useStore((s) => s.settings.name);
  const reorderActivities = useStore((s) => s.reorderActivities);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const dayActivities = useMemo(
    () =>
      activities
        .filter((a) => a.date === date)
        .sort((a, b) => a.order - b.order),
    [activities, date],
  );

  const goalById = useMemo(
    () => Object.fromEntries(goals.map((g) => [g.id, g])),
    [goals],
  );

  const doneCount = dayActivities.filter((a) => a.status === "done").length;
  const total = dayActivities.length;
  const plannedMinutes = dayActivities
    .filter((a) => a.status !== "done")
    .reduce((sum, a) => sum + (a.durationMin ?? 0), 0);

  const nextUp = dayActivities.find((a) => a.status !== "done");

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = dayActivities.map((a) => a.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    reorderActivities(date, arrayMove(ids, oldIndex, newIndex));
  };

  return (
    <div className="view">
      <header className="view-header">
        <div className="greeting">
          {greeting()}
          {name ? `, ${name}` : ""} 👋
        </div>
        <div className="date-nav">
          <button
            className="icon-btn"
            onClick={() => setDate((d) => addDays(d, -1))}
            aria-label="Vorheriger Tag"
          >
            ‹
          </button>
          <button className="date-label" onClick={() => setDate(todayKey())}>
            {relativeDayLabel(date)}
          </button>
          <button
            className="icon-btn"
            onClick={() => setDate((d) => addDays(d, 1))}
            aria-label="Nächster Tag"
          >
            ›
          </button>
        </div>
      </header>

      {nextUp ? (
        <section className="now-card">
          <div className="now-label">Jetzt dran</div>
          <div className="now-title">{nextUp.title}</div>
          <div className="now-meta">
            {nextUp.durationMin != null && (
              <span>⏱ {formatDuration(nextUp.durationMin)}</span>
            )}
            {nextUp.scheduledTime && <span>🕒 {nextUp.scheduledTime}</span>}
          </div>
          <button className="btn primary big" onClick={() => onStartFocus(nextUp.id)}>
            ⏳ Los geht’s – Fokus starten
          </button>
          <p className="now-hint">
            Tipp: Starte einfach <strong>10 Minuten</strong>. Der Anfang ist das
            Schwerste – der Rest kommt von selbst.
          </p>
        </section>
      ) : (
        total === 0 && (
          <section className="empty">
            <div className="empty-emoji">🌤️</div>
            <h2>Ein leerer, freundlicher Tag</h2>
            <p>
              Plane unten deine erste Aktivität. Klein anfangen ist völlig in
              Ordnung – ein Punkt reicht.
            </p>
          </section>
        )
      )}

      {total > 0 && (
        <section className="day-progress">
          <div className="progress-head">
            <span>
              {doneCount} von {total} erledigt
            </span>
            {plannedMinutes > 0 && (
              <span className="muted">
                noch ~{formatDuration(plannedMinutes)} geplant
              </span>
            )}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
            />
          </div>
        </section>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={dayActivities.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="activity-list">
            {dayActivities.map((a) => (
              <SortableActivity
                key={a.id}
                activity={a}
                goal={a.goalId ? goalById[a.goalId] : undefined}
                onStartFocus={(id) => onStartFocus(id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <AddActivityForm date={date} />
    </div>
  );
}
