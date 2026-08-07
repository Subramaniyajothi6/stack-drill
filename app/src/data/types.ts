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

/** A note written by the user in their own words — the "my version" of a
 * concept they can glance at later instead of relearning from the docs. */
export interface SkillNote {
  id: string;
  title: string;
  body: string;
  /** Date key (YYYY-MM-DD) the note was first written. */
  created: string;
  /** Date key of the last edit; equals `created` until edited. */
  updated: string;
}

export interface Skill {
  name: string;
  level: SkillLevel;
  note: string;
  links: SkillLink[];
  /** Optional so skills seeded before this feature still parse. */
  notes?: SkillNote[];
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
