import type { CustomQuest, QuestMode, Skill, WeakSpot } from "../data/types";
import { PHASES, SKILLS, WEAK } from "../data/seed";
import { todayKey } from "./date";

const STORAGE_KEY = "stack-drill:v2";

export interface StoredData {
  startDate: string;
  questMode: QuestMode;
  /** Sticky once true — reaching a 7-day streak once keeps the full plan
   * available as an option even if the streak later drops. */
  fullModeUnlocked: boolean;
  /** date key -> ids of quests completed that day. This is the only source
   * of truth for streaks, XP and the heatmap — nothing here is seeded. */
  history: Record<string, string[]>;
  cleared: Record<string, boolean>;
  skills: Skill[];
  /** Quests the user added themselves; shown alongside the built-in set. */
  customQuests: CustomQuest[];
  /** Editable — seeded from real drill scores, updated as you re-drill. */
  weakSpots: WeakSpot[];
}

function defaultData(): StoredData {
  return {
    startDate: todayKey(),
    questMode: "onehour",
    fullModeUnlocked: false,
    history: {},
    cleared: Object.fromEntries(PHASES.map((p) => [p.n, false])),
    // Notes start empty — they're yours to write, nothing is seeded.
    skills: SKILLS.map((sk) => ({ ...sk, notes: [] })),
    customQuests: [],
    weakSpots: WEAK,
  };
}

/** Your saved skills win — they carry your links and notes — but skills added
 * to the seed catalog since you last saved get appended rather than dropped.
 * Without this, a returning user never sees newly shipped skills at all.
 * A skill you deleted stays deleted only until the seed changes; the catalog
 * is app-owned, unlike the links and notes inside it. */
function mergeSkills(saved: unknown, seeded: Skill[]): Skill[] {
  if (!Array.isArray(saved) || saved.length === 0) return seeded;
  const normalised: Skill[] = saved.map((sk: Skill) => ({ ...sk, notes: sk.notes ?? [] }));
  const savedNames = new Set(normalised.map((sk) => sk.name));
  return [...normalised, ...seeded.filter((sk) => !savedNames.has(sk.name))];
}

/** The only function in this app allowed to read localStorage. */
export function load(): StoredData {
  const fallback = defaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      startDate: typeof parsed.startDate === "string" ? parsed.startDate : fallback.startDate,
      questMode: parsed.questMode === "full" ? "full" : "onehour",
      fullModeUnlocked: !!parsed.fullModeUnlocked,
      history:
        parsed.history && typeof parsed.history === "object" && !Array.isArray(parsed.history)
          ? parsed.history
          : {},
      cleared: { ...fallback.cleared, ...(parsed.cleared ?? {}) },
      skills: mergeSkills(parsed.skills, fallback.skills),
      customQuests: Array.isArray(parsed.customQuests) ? parsed.customQuests : [],
      weakSpots: Array.isArray(parsed.weakSpots) ? parsed.weakSpots : fallback.weakSpots,
    };
  } catch {
    return fallback;
  }
}

/** The only function in this app allowed to write localStorage. */
export function save(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable (private mode, quota) — state still works for this session
  }
}
