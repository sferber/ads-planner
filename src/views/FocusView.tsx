import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../store/useStore";
import VisualTimer from "../components/VisualTimer";
import { todayKey } from "../lib/date";

interface Props {
  initialActivityId: string | null;
  onClearInitial: () => void;
}

type Mode = "focus" | "break";

function mmss(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FocusView({ initialActivityId, onClearInitial }: Props) {
  const activities = useStore((s) => s.activities);
  const settings = useStore((s) => s.settings);
  const setActivityStatus = useStore((s) => s.setActivityStatus);

  const openToday = useMemo(
    () =>
      activities.filter((a) => a.date === todayKey() && a.status !== "done"),
    [activities],
  );

  const [selectedId, setSelectedId] = useState<string | null>(initialActivityId);
  const [mode, setMode] = useState<Mode>("focus");
  const [totalSec, setTotalSec] = useState(settings.focusDurationMin * 60);
  const [remaining, setRemaining] = useState(settings.focusDurationMin * 60);
  const [running, setRunning] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialActivityId) {
      setSelectedId(initialActivityId);
      setRunning(true);
      onClearInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialActivityId]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(intervalRef.current!);
          setRunning(false);
          setCelebrate(true);
          if ("vibrate" in navigator) navigator.vibrate?.(200);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  const setDuration = (min: number, nextMode: Mode = "focus") => {
    setMode(nextMode);
    setTotalSec(min * 60);
    setRemaining(min * 60);
    setRunning(false);
    setCelebrate(false);
  };

  const selected = selectedId
    ? activities.find((a) => a.id === selectedId)
    : undefined;

  const progress = totalSec ? remaining / totalSec : 0;
  const ringColor = mode === "break" ? "#2dbd8b" : "#5b8def";

  const finishAndComplete = () => {
    if (selected) setActivityStatus(selected.id, "done");
    setCelebrate(false);
    setSelectedId(null);
    setDuration(settings.breakMin, "break");
  };

  return (
    <div className="view focus-view">
      <header className="view-header">
        <div className="greeting">
          {mode === "break" ? "Kurze Pause ☕" : "Fokus-Modus ⏳"}
        </div>
        <p className="subtitle">
          {mode === "break"
            ? "Steh kurz auf, trink etwas. Pausen sind Teil der Arbeit."
            : "Eine Sache. Jetzt. Mehr nicht."}
        </p>
      </header>

      {mode === "focus" && (
        <div className="focus-task">
          <select
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(e.target.value || null)}
          >
            <option value="">Freier Fokus (ohne Aufgabe)</option>
            {openToday.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="timer-wrap">
        <VisualTimer
          progress={progress}
          color={ringColor}
          label={mmss(remaining)}
          sublabel={
            celebrate
              ? "Geschafft! 🎉"
              : selected
                ? selected.title
                : mode === "break"
                  ? "Pause"
                  : "Fokuszeit"
          }
        />
      </div>

      {!celebrate ? (
        <>
          <div className="timer-controls">
            {!running ? (
              <button
                className="btn primary big"
                onClick={() => setRunning(true)}
              >
                ▶ Start
              </button>
            ) : (
              <button className="btn big" onClick={() => setRunning(false)}>
                ⏸ Pause
              </button>
            )}
            <button
              className="btn ghost big"
              onClick={() => setDuration(totalSec / 60, mode)}
            >
              ↺ Zurücksetzen
            </button>
          </div>

          <div className="duration-presets">
            <span className="muted small">Dauer:</span>
            <button className="chip-btn" onClick={() => setDuration(10)}>
              10 Min starten
            </button>
            <button className="chip-btn" onClick={() => setDuration(25)}>
              25 Min
            </button>
            <button className="chip-btn" onClick={() => setDuration(50)}>
              50 Min
            </button>
          </div>

          {mode === "focus" && (
            <p className="focus-hint">
              Der Trick gegen den inneren Widerstand:{" "}
              <strong>Fang einfach mit 10 Minuten an.</strong> Du darfst danach
              aufhören – meistens willst du das gar nicht mehr.
            </p>
          )}
        </>
      ) : (
        <div className="celebrate">
          <div className="celebrate-emoji">🎉</div>
          <p>Stark! Du hast eine ganze Runde durchgezogen.</p>
          <div className="row-gap center">
            {mode === "focus" && selected && (
              <button className="btn primary" onClick={finishAndComplete}>
                ✓ Erledigt & Pause
              </button>
            )}
            <button
              className="btn"
              onClick={() =>
                setDuration(
                  mode === "focus" ? settings.breakMin : settings.focusDurationMin,
                  mode === "focus" ? "break" : "focus",
                )
              }
            >
              {mode === "focus" ? "☕ Pause starten" : "⏳ Weiter fokussieren"}
            </button>
            <button
              className="btn ghost"
              onClick={() => setDuration(settings.focusDurationMin, "focus")}
            >
              Neue Runde
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
