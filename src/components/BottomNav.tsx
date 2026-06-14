export type Tab = "today" | "goals" | "focus" | "progress";

const ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "today", label: "Heute", icon: "📅" },
  { id: "goals", label: "Ziele", icon: "🎯" },
  { id: "focus", label: "Fokus", icon: "⏳" },
  { id: "progress", label: "Ich", icon: "✨" },
];

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item${active === item.id ? " active" : ""}`}
          onClick={() => onChange(item.id)}
          aria-current={active === item.id ? "page" : undefined}
        >
          <span className="nav-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
