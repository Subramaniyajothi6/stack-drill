import { PHASES } from "../../data/seed";

interface Props {
  cleared: Record<string, boolean>;
  clearedCount: number;
  hoursTotal: number;
  onTogglePhase: (n: string) => void;
}

export function RoadmapScreen({ cleared, clearedCount, hoursTotal, onTogglePhase }: Props) {
  return (
    <div className="roadmap-page">
      <div className="section-title-row">
        <h3 className="section-title" style={{ border: 0, padding: 0, margin: 0 }}>
          Eight phases, {hoursTotal} hours, one freelance-ready stack
        </h3>
        <span className="section-meta">{clearedCount} of 8 phases cleared · tap a phase to mark it</span>
      </div>

      <div className="roadmap-list">
        {PHASES.map((p) => {
          const isCleared = !!cleared[p.n];
          return (
            <div
              key={p.n}
              className="phase-row"
              style={{ background: isCleared ? "var(--color-accent-100)" : "transparent" }}
            >
              <div>
                <div className="n" style={{ color: isCleared ? "var(--color-accent)" : "var(--color-neutral-400)" }}>
                  {p.n}
                </div>
                <div className="weeks">{p.weeks}</div>
                <div className="hours">
                  {p.hours} · {p.xp} XP
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: 10, justifyContent: "flex-start", width: "100%" }}
                  onClick={() => onTogglePhase(p.n)}
                >
                  {isCleared ? "✓ Cleared" : "Mark cleared"}
                </button>
              </div>
              <div>
                <div className="title">{p.title}</div>
                <p className="why">{p.why}</p>
                <ul className="tasks">
                  {p.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="phase-boss">
                <div className="kicker">Boss fight</div>
                <div className="boss-title">{p.boss}</div>
                <div className="proof">Client-facing proof: {p.proof}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
