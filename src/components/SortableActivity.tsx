import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Activity, Energy, Goal } from "../types";
import { useStore } from "../store/useStore";
import { addDays, formatDuration } from "../lib/date";

const ENERGY_META: Record<Energy, { label: string; emoji: string }> = {
  low: { label: "Wenig Energie", emoji: "🪫" },
  medium: { label: "Mittel", emoji: "🔋" },
  high: { label: "Volle Energie", emoji: "⚡" },
};

interface Props {
  activity: Activity;
  goal?: Goal;
  onStartFocus: (id: string) => void;
}

export default function SortableActivity({
  activity,
  goal,
  onStartFocus,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const setActivityStatus = useStore((s) => s.setActivityStatus);
  const updateActivity = useStore((s) => s.updateActivity);
  const deleteActivity = useStore((s) => s.deleteActivity);
  const moveActivityToDate = useStore((s) => s.moveActivityToDate);
  const goals = useStore((s) => s.goals);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const done = activity.status === "done";

  const toggleDone = () => {
    setActivityStatus(activity.id, done ? "open" : "done");
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`activity${done ? " done" : ""}${
        activity.status === "active" ? " active" : ""
      }`}
    >
      <div className="activity-main">
        <button
          className="drag-handle"
          aria-label="Verschieben"
          {...attributes}
          {...listeners}
        >
          ⠿
        </button>

        <button
          className={`check${done ? " checked" : ""}`}
          onClick={toggleDone}
          aria-label={done ? "Als offen markieren" : "Als erledigt markieren"}
        >
          {done ? "✓" : ""}
        </button>

        <button
          className="activity-body"
          onClick={() => setExpanded((e) => !e)}
        >
          <span className="activity-title">{activity.title}</span>
          <span className="activity-chips">
            {activity.scheduledTime && (
              <span className="chip time">🕒 {activity.scheduledTime}</span>
            )}
            {activity.durationMin != null && (
              <span className="chip">⏱ {formatDuration(activity.durationMin)}</span>
            )}
            {activity.energy && (
              <span className="chip">
                {ENERGY_META[activity.energy].emoji}{" "}
                {ENERGY_META[activity.energy].label}
              </span>
            )}
            {goal && (
              <span className="chip goal" style={{ color: goal.color }}>
                <span
                  className="goal-dot"
                  style={{ background: goal.color }}
                  aria-hidden="true"
                />
                {goal.title}
              </span>
            )}
          </span>
        </button>
      </div>

      {expanded && (
        <div className="activity-edit">
          <label className="field">
            <span>Titel</span>
            <input
              value={activity.title}
              onChange={(e) =>
                updateActivity(activity.id, { title: e.target.value })
              }
            />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Dauer (Min)</span>
              <input
                type="number"
                min={0}
                step={5}
                value={activity.durationMin ?? ""}
                onChange={(e) =>
                  updateActivity(activity.id, {
                    durationMin: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </label>
            <label className="field">
              <span>Uhrzeit</span>
              <input
                type="time"
                value={activity.scheduledTime ?? ""}
                onChange={(e) =>
                  updateActivity(activity.id, {
                    scheduledTime: e.target.value || undefined,
                  })
                }
              />
            </label>
          </div>
          <div className="field-row">
            <label className="field">
              <span>Energie</span>
              <select
                value={activity.energy ?? ""}
                onChange={(e) =>
                  updateActivity(activity.id, {
                    energy: (e.target.value || undefined) as Energy | undefined,
                  })
                }
              >
                <option value="">–</option>
                <option value="low">🪫 Wenig</option>
                <option value="medium">🔋 Mittel</option>
                <option value="high">⚡ Voll</option>
              </select>
            </label>
            <label className="field">
              <span>Ziel</span>
              <select
                value={activity.goalId ?? ""}
                onChange={(e) =>
                  updateActivity(activity.id, {
                    goalId: e.target.value || undefined,
                  })
                }
              >
                <option value="">–</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="activity-actions">
            <button
              className="btn small"
              onClick={() => {
                onStartFocus(activity.id);
                setExpanded(false);
              }}
            >
              ⏳ Fokus starten
            </button>
            <button
              className="btn small ghost"
              onClick={() =>
                moveActivityToDate(activity.id, addDays(activity.date, 1))
              }
            >
              ➜ Auf morgen
            </button>
            <button
              className="btn small danger"
              onClick={() => deleteActivity(activity.id)}
            >
              🗑 Löschen
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
