import { useState } from "react";
import TodayView from "./views/TodayView";
import GoalsView from "./views/GoalsView";
import FocusView from "./views/FocusView";
import ProgressView from "./views/ProgressView";
import BottomNav, { type Tab } from "./components/BottomNav";
import { useStore } from "./store/useStore";

export default function App() {
  const [tab, setTab] = useState<Tab>("today");
  const [focusActivityId, setFocusActivityId] = useState<string | null>(null);
  const reduceMotion = useStore((s) => s.settings.reduceMotion);

  const goToFocus = (activityId?: string) => {
    setFocusActivityId(activityId ?? null);
    setTab("focus");
  };

  return (
    <div className={`app${reduceMotion ? " reduce-motion" : ""}`}>
      <main className="screen">
        {tab === "today" && <TodayView onStartFocus={goToFocus} />}
        {tab === "goals" && <GoalsView />}
        {tab === "focus" && (
          <FocusView
            initialActivityId={focusActivityId}
            onClearInitial={() => setFocusActivityId(null)}
          />
        )}
        {tab === "progress" && <ProgressView />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
