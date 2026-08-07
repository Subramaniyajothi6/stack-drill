import type { QuestMode, Skill } from "../data/types";
import { PHASES, SKILLS } from "../data/seed";
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
}

function defaultData(): StoredData {
  return {
    startDate: todayKey(),
    questMode: "onehour",
    fullModeUnlocked: false,
    history: {},
    cleared: Object.fromEntries(PHASES.map((p) => [p.n, false])),
    skills: SKILLS,
  };
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
      skills: Array.isArray(parsed.skills) && parsed.skills.length ? parsed.skills : fallback.skills,
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
