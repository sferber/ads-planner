import { useState } from "react";
import { useStore } from "../store/useStore";
import type { Energy } from "../types";

interface Props {
  date: string;
}

/** Schnelles, reizarmes Hinzufügen: Titel reicht, der Rest ist optional. */
export default function AddActivityForm({ date }: Props) {
  const addActivity = useStore((s) => s.addActivity);
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [durationMin, setDurationMin] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [energy, setEnergy] = useState<Energy | "">("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    addActivity({
      title: t,
      date,
      durationMin: durationMin ? Number(durationMin) : undefined,
      scheduledTime: scheduledTime || undefined,
      energy: energy || undefined,
    });
    setTitle("");
    setDurationMin("");
    setScheduledTime("");
    setEnergy("");
    setOpen(false);
  };

  return (
    <form className="add-activity" onSubmit={submit}>
      <div className="add-row">
        <input
          className="add-input"
          placeholder="Was möchtest du tun?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <button className="btn add-btn" type="submit" aria-label="Hinzufügen">
          +
        </button>
      </div>
      {open && (
        <div className="add-details">
          <label className="field">
            <span>Dauer (Min)</span>
            <input
              type="number"
              min={0}
              step={5}
              placeholder="z. B. 20"
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Uhrzeit</span>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Energie</span>
            <select
              value={energy}
              onChange={(e) => setEnergy(e.target.value as Energy | "")}
            >
              <option value="">–</option>
              <option value="low">🪫 Wenig</option>
              <option value="medium">🔋 Mittel</option>
              <option value="high">⚡ Voll</option>
            </select>
          </label>
        </div>
      )}
    </form>
  );
}
