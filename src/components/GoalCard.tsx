import { useState } from "react";
import type { Goal } from "../types";
import { useStore } from "../store/useStore";

interface Props {
  goal: Goal;
}

export default function GoalCard({ goal }: Props) {
  const toggleStep = useStore((s) => s.toggleStep);
  const addStep = useStore((s) => s.addStep);
  const removeStep = useStore((s) => s.removeStep);
  const planStepToday = useStore((s) => s.planStepToday);
  const addIfThen = useStore((s) => s.addIfThen);
  const removeIfThen = useStore((s) => s.removeIfThen);
  const updateGoal = useStore((s) => s.updateGoal);
  const deleteGoal = useStore((s) => s.deleteGoal);

  const [stepText, setStepText] = useState("");
  const [ifText, setIfText] = useState("");
  const [thenText, setThenText] = useState("");
  const [editing, setEditing] = useState(false);

  const doneSteps = goal.steps.filter((s) => s.done).length;
  const pct = goal.steps.length
    ? Math.round((doneSteps / goal.steps.length) * 100)
    : 0;

  return (
    <article className="goal-card" style={{ borderTopColor: goal.color }}>
      <div className="goal-head">
        <div>
          <h3 className="goal-title">{goal.title}</h3>
          {goal.why && <p className="goal-why">💡 {goal.why}</p>}
        </div>
        <button
          className="icon-btn"
          aria-label="Ziel bearbeiten"
          onClick={() => setEditing((e) => !e)}
        >
          ⋯
        </button>
      </div>

      {editing && (
        <div className="goal-edit">
          <label className="field">
            <span>Titel</span>
            <input
              value={goal.title}
              onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Warum ist dir das wichtig?</span>
            <input
              value={goal.why ?? ""}
              placeholder="Deine Motivation …"
              onChange={(e) => updateGoal(goal.id, { why: e.target.value })}
            />
          </label>
          <button
            className="btn small danger"
            onClick={() => deleteGoal(goal.id)}
          >
            🗑 Ziel löschen
          </button>
        </div>
      )}

      {goal.steps.length > 0 && (
        <div className="goal-progress">
          <div className="progress-bar slim">
            <div
              className="progress-fill"
              style={{ width: `${pct}%`, background: goal.color }}
            />
          </div>
          <span className="muted small">
            {doneSteps}/{goal.steps.length} Schritte
          </span>
        </div>
      )}

      <ul className="step-list">
        {goal.steps.map((step) => (
          <li key={step.id} className={`step${step.done ? " done" : ""}`}>
            <button
              className={`check small${step.done ? " checked" : ""}`}
              onClick={() => toggleStep(goal.id, step.id)}
              aria-label={step.done ? "Schritt offen" : "Schritt erledigt"}
            >
              {step.done ? "✓" : ""}
            </button>
            <span className="step-text">{step.text}</span>
            {!step.done && (
              <button
                className="link-btn"
                title="In den heutigen Plan übernehmen"
                onClick={() => planStepToday(goal.id, step.id)}
              >
                + Heute
              </button>
            )}
            <button
              className="link-btn danger"
              aria-label="Schritt löschen"
              onClick={() => removeStep(goal.id, step.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <form
        className="add-row inline"
        onSubmit={(e) => {
          e.preventDefault();
          if (!stepText.trim()) return;
          addStep(goal.id, stepText);
          setStepText("");
        }}
      >
        <input
          className="add-input"
          placeholder="Nächster kleiner Schritt …"
          value={stepText}
          onChange={(e) => setStepText(e.target.value)}
        />
        <button className="btn add-btn" type="submit" aria-label="Schritt hinzufügen">
          +
        </button>
      </form>

      <div className="if-then-section">
        <div className="if-then-head">Wenn-Dann-Pläne</div>
        {goal.ifThen.length === 0 && (
          <p className="muted small">
            Plane Hürden vor: „Wenn X passiert, dann mache ich Y.“ Das hilft
            nachweislich, ins Handeln zu kommen.
          </p>
        )}
        <ul className="if-then-list">
          {goal.ifThen.map((p) => (
            <li key={p.id} className="if-then">
              <span>
                <strong>Wenn</strong> {p.ifText}, <strong>dann</strong>{" "}
                {p.thenText}.
              </span>
              <button
                className="link-btn danger"
                aria-label="Plan löschen"
                onClick={() => removeIfThen(goal.id, p.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <form
          className="if-then-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!ifText.trim() || !thenText.trim()) return;
            addIfThen(goal.id, { ifText: ifText.trim(), thenText: thenText.trim() });
            setIfText("");
            setThenText("");
          }}
        >
          <div className="if-then-inputs">
            <span className="kw">Wenn</span>
            <input
              placeholder="ich abgelenkt werde …"
              value={ifText}
              onChange={(e) => setIfText(e.target.value)}
            />
            <span className="kw">dann</span>
            <input
              placeholder="lege ich das Handy weg."
              value={thenText}
              onChange={(e) => setThenText(e.target.value)}
            />
          </div>
          <button className="btn small" type="submit">
            Plan hinzufügen
          </button>
        </form>
      </div>
    </article>
  );
}
