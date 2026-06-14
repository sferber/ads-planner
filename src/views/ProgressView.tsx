import { useMemo } from "react";
import { useStore } from "../store/useStore";
import {
  BADGES,
  activeDaysThisWeek,
  currentStreak,
} from "../lib/gamification";
import { addDays, todayKey } from "../lib/date";

const WEEK_LETTERS = ["M", "D", "M", "D", "F", "S", "S"];

export default function ProgressView() {
  const progress = useStore((s) => s.progress);
  const settings = useStore((s) => s.settings);
  const activities = useStore((s) => s.activities);
  const updateSettings = useStore((s) => s.updateSettings);
  const resetAll = useStore((s) => s.resetAll);

  const streak = currentStreak(progress.completionDates);
  const weekActive = activeDaysThisWeek(progress.completionDates);
  const earned = new Set(progress.badges);

  const doneToday = useMemo(
    () =>
      activities.filter((a) => a.date === todayKey() && a.status === "done"),
    [activities],
  );

  // Letzte 7 Tage als Punkte (Mo..So-Logik vereinfacht: heute rückwärts).
  const last7 = useMemo(() => {
    const set = new Set(progress.completionDates);
    return Array.from({ length: 7 }, (_, i) => {
      const key = addDays(todayKey(), -(6 - i));
      return { key, active: set.has(key) };
    });
  }, [progress.completionDates]);

  return (
    <div className="view">
      <header className="view-header">
        <div className="greeting">Dein Fortschritt ✨</div>
        <p className="subtitle">
          Es zählt, dass du dranbleibst – nicht, dass du perfekt bist.
        </p>
      </header>

      <section className="stat-row">
        <div className="stat-card">
          <div className="stat-value">{progress.points}</div>
          <div className="stat-label">Punkte</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{streak} 🔥</div>
          <div className="stat-label">Tage in Folge</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{weekActive}/7</div>
          <div className="stat-label">aktive Tage</div>
        </div>
      </section>

      <section className="card">
        <h3>Diese Woche</h3>
        <div className="week-dots">
          {last7.map((d, i) => (
            <div key={d.key} className="week-day">
              <div className={`week-dot${d.active ? " on" : ""}`} />
              <span>{WEEK_LETTERS[i]}</span>
            </div>
          ))}
        </div>
        <p className="muted small">
          Lücken sind okay. Jeder aktive Tag ist ein Gewinn – du fängst nie bei
          null an.
        </p>
      </section>

      <section className="card">
        <h3>Heute geschafft 🎉</h3>
        {doneToday.length === 0 ? (
          <p className="muted small">
            Noch nichts abgehakt – und das ist völlig in Ordnung. Ein winziger
            Schritt reicht.
          </p>
        ) : (
          <ul className="review-list">
            {doneToday.map((a) => (
              <li key={a.id}>✓ {a.title}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h3>Abzeichen</h3>
        <div className="badge-grid">
          {BADGES.map((b) => {
            const has = earned.has(b.id);
            return (
              <div
                key={b.id}
                className={`badge${has ? " earned" : ""}`}
                title={b.description}
              >
                <div className="badge-emoji">{has ? b.emoji : "🔒"}</div>
                <div className="badge-title">{b.title}</div>
                <div className="badge-desc">{b.description}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h3>Einstellungen</h3>
        <label className="field">
          <span>Dein Name (optional)</span>
          <input
            value={settings.name ?? ""}
            placeholder="Wie sollen wir dich nennen?"
            onChange={(e) => updateSettings({ name: e.target.value || undefined })}
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Fokus-Dauer (Min)</span>
            <input
              type="number"
              min={5}
              max={120}
              step={5}
              value={settings.focusDurationMin}
              onChange={(e) =>
                updateSettings({ focusDurationMin: Number(e.target.value) || 25 })
              }
            />
          </label>
          <label className="field">
            <span>Pausen-Dauer (Min)</span>
            <input
              type="number"
              min={1}
              max={60}
              step={1}
              value={settings.breakMin}
              onChange={(e) =>
                updateSettings({ breakMin: Number(e.target.value) || 5 })
              }
            />
          </label>
        </div>
        <label className="toggle-field">
          <input
            type="checkbox"
            checked={settings.reduceMotion}
            onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
          />
          <span>Animationen reduzieren (ruhigere Oberfläche)</span>
        </label>
      </section>

      <section className="card">
        <h3>Daten</h3>
        <p className="muted small">
          Alle Daten bleiben nur auf diesem Gerät (lokal im Browser). Nichts wird
          hochgeladen.
        </p>
        <button
          className="btn small danger"
          onClick={() => {
            if (
              window.confirm(
                "Wirklich alle Aktivitäten, Ziele und den Fortschritt löschen?",
              )
            ) {
              resetAll();
            }
          }}
        >
          Alle Daten zurücksetzen
        </button>
      </section>

      <footer className="app-footer">
        Fokusplan · gestaltet nach Erkenntnissen aus der ADHS-Forschung
      </footer>
    </div>
  );
}
