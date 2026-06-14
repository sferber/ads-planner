import { useState } from "react";
import { useStore } from "../store/useStore";
import GoalCard from "../components/GoalCard";

export default function GoalsView() {
  const goals = useStore((s) => s.goals);
  const addGoal = useStore((s) => s.addGoal);
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [adding, setAdding] = useState(false);

  const active = goals.filter((g) => !g.archived);

  return (
    <div className="view">
      <header className="view-header">
        <div className="greeting">Deine Ziele 🎯</div>
        <p className="subtitle">
          Große Ziele in kleine Schritte zerlegen – und Hürden vorausplanen.
        </p>
      </header>

      {!adding ? (
        <button className="btn primary full" onClick={() => setAdding(true)}>
          + Neues Ziel
        </button>
      ) : (
        <form
          className="new-goal"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            addGoal(title, why);
            setTitle("");
            setWhy("");
            setAdding(false);
          }}
        >
          <label className="field">
            <span>Was möchtest du erreichen?</span>
            <input
              autoFocus
              value={title}
              placeholder="z. B. Wohnung aufräumen"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Warum ist dir das wichtig? (optional)</span>
            <input
              value={why}
              placeholder="z. B. Damit ich mich zuhause wohler fühle"
              onChange={(e) => setWhy(e.target.value)}
            />
          </label>
          <div className="row-gap">
            <button className="btn primary" type="submit">
              Ziel anlegen
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => setAdding(false)}
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {active.length === 0 && !adding && (
        <section className="empty">
          <div className="empty-emoji">🌱</div>
          <h2>Noch keine Ziele</h2>
          <p>
            Ein Ziel gibt deinem Tag Richtung. Du musst es nicht heute schaffen –
            ein erster kleiner Schritt genügt.
          </p>
        </section>
      )}

      <div className="goal-grid">
        {active.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
      </div>
    </div>
  );
}
