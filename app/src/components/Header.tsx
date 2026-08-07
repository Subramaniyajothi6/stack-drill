interface Props {
  kicker: string;
  title: string;
  streak: number;
  doneCount: number;
  questCount: number;
  freezes: number;
}

export function Header({ kicker, title, streak, doneCount, questCount, freezes }: Props) {
  return (
    <header className="page-header">
      <div>
        <div className="kicker">{kicker}</div>
        <h1>{title}</h1>
      </div>
      <div className="page-header-stats">
        <div>
          <div className="kicker">Streak</div>
          <div className="stat-value">{streak} days</div>
        </div>
        <div>
          <div className="kicker">Today</div>
          <div className="stat-value">
            {doneCount}/{questCount}
          </div>
        </div>
        <div>
          <div className="kicker">Freeze tokens</div>
          <div className="stat-value">{freezes}</div>
        </div>
      </div>
    </header>
  );
}
