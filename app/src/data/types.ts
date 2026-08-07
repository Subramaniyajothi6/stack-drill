export type Screen = "today" | "streaks" | "roadmap" | "skills";

export type QuestMode = "onehour" | "full";

export interface Quest {
  id: string;
  title: string;
  detail: string;
  slot: string;
  short: string;
  xp: number;
}

export interface Phase {
  n: string;
  weeks: string;
  hours: string;
  xp: number;
  title: string;
  why: string;
  tasks: string[];
  boss: string;
  proof: string;
}

export type SkillLevel = "Solid" | "Next up" | "Weak spot" | "New";

export interface SkillLink {
  id: string;
  kind: string;
  label: string;
  url: string;
}

export interface Skill {
  name: string;
  level: SkillLevel;
  note: string;
  links: SkillLink[];
}

export interface WeakSpot {
  name: string;
  pct: number;
  note: string;
}

export interface Fallback {
  title: string;
  body: string;
}

export interface Badge {
  name: string;
  how: string;
  earned: boolean;
}

export interface Block {
  time: string;
  what: string;
}
