import type { Screen } from "../data/types";
import { SCREEN_TITLES } from "../data/seed";

interface Props {
  screen: Screen;
  screenOrder: Screen[];
  onNavigate: (screen: Screen) => void;
  level: number;
  levelTitle: string;
  xpDisplay: string;
  levelPct: number;
  xpToNext: number;
  nextLevel: number;
}

export function Sidebar({
  screen,
  screenOrder,
  onNavigate,
  level,
  levelTitle,
  xpDisplay,
  levelPct,
  xpToNext,
  nextLevel,
}: Props) {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          STACK<span className="slash">/</span>DRILL
        </div>
        <div className="sidebar-subtitle">Habits + 20-week path</div>
      </div>

      <nav className="sidebar-nav">
        {screenOrder.map((key, i) => {
          const active = screen === key;
          return (
            <button
              key={key}
              className={"nav-btn" + (active ? " active" : "")}
              onClick={() => onNavigate(key)}
            >
              <span className="nav-num">0{i + 1}</span>
              <span>{SCREEN_TITLES[key]}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-level">
        <div className="kicker">
          Level {level} · {levelTitle}
        </div>
        <div className="xp-amount">{xpDisplay} XP</div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${levelPct}%` }} />
        </div>
        <div className="xp-to-next">
          {xpToNext} XP to level {nextLevel}
        </div>
      </div>
    </aside>
  );
}
