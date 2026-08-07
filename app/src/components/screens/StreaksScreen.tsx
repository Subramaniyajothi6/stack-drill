import type { HeatData } from "../../data/heatmap";
import type { Badge } from "../../data/types";

interface Props {
  heat: HeatData;
  streak: number;
  longest: number;
  badges: Badge[];
}

export function StreaksScreen({ heat, streak, longest, badges }: Props) {
  return (
    <div className="streaks-page">
      <section>
        <div className="section-title-row">
          <h3 className="section-title" style={{ border: 0, padding: 0, margin: 0 }}>
            Last 140 days
          </h3>
          <span className="section-meta">
            {heat.green} active days · {streak}-day current streak · longest {longest}
          </span>
        </div>
        <div className="heatmap-scroll">
          {heat.weeks.map((w, i) => (
            <div className="heatmap-week" key={i}>
              {w.days.map((d, j) => (
                <div key={j} className="heatmap-day" style={{ background: d.bg }} title={d.title} />
              ))}
            </div>
          ))}
        </div>
        <div className="heatmap-legend">
          <span>Nothing</span>
          {heat.legend.map((l, i) => (
            <div key={i} className="heatmap-legend-swatch" style={{ background: l.bg }} />
          ))}
          <span>Most quests done</span>
        </div>
      </section>

      <section className="badges-section">
        <h3 style={{ fontSize: 20, margin: "0 0 12px" }}>Badges</h3>
        <div className="badges-grid">
          {badges.map((b) => (
            <div key={b.name} className="badge-card" style={{ opacity: b.earned ? 1 : 0.5 }}>
              <div className="row">
                <span className="name">{b.name}</span>
                <span className={"tag " + (b.earned ? "tag-accent" : "tag-outline")} style={{ fontSize: 10 }}>
                  {b.earned ? "Earned" : "Locked"}
                </span>
              </div>
              <div className="how">{b.how}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
