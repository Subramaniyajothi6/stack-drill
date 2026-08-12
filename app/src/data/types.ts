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

/** A quest the user wrote themselves, alongside the built-in ones.
 *
 * Deleting sets `archived` rather than dropping the record: `history` stores
 * only quest ids, so a removed definition would silently shrink past XP and
 * change days already counted. Archived quests leave today's list but stay
 * resolvable for everything already logged against them. */
export interface CustomQuest extends Quest {
  archived?: boolean;
}

export type SkillLevel = "Solid" | "Next up" | "Weak spot" | "New";

export interface SkillLink {
  id: string;
  kind: string;
  label: string;
  url: string;
  /** Ticked off once you've finished it — courses are worth tracking, not
   * just collecting. Optional so links saved before this field still parse. */
  done?: boolean;
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
  id: string;
  name: string;
  /** 0–100. Your honest read or a real drill score, not a generated number. */
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
