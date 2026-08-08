import { useMemo } from "react";
import type { StoredData } from "../lib/storage";
import { addDaysToKey, daysBetween, todayKey } from "../lib/date";
import {
  FREEZE_TOKENS,
  FULL_MODE_UNLOCK_STREAK,
  HOURS_TOTAL,
  LEVEL_TITLE,
  ONE_HOUR_QUEST,
  PHASES,
  QUESTS_FULL,
  SCREEN_TAGLINES,
  SCREEN_TITLES,
} from "../data/seed";
import { buildHeatmap } from "../data/heatmap";
import type { Badge, Quest, Screen } from "../data/types";

export interface QuestVM extends Quest {
  on: boolean;
  /** True for user-added quests — only those get edit/delete controls. */
  custom: boolean;
}

const BUILT_IN_QUESTS: readonly (readonly [string, Quest])[] = [
  ...QUESTS_FULL.map((q) => [q.id, q] as const),
  [ONE_HOUR_QUEST.id, ONE_HOUR_QUEST] as const,
];

/** Consecutive active days ending today. If today has nothing logged yet,
 * counts back from yesterday instead of zeroing out mid-day. */
function computeCurrentStreak(history: Record<string, string[]>, today: string): number {
  const hasToday = (history[today]?.length ?? 0) > 0;
  let cursor = hasToday ? today : addDaysToKey(today, -1);
  let streak = 0;
  while ((history[cursor]?.length ?? 0) > 0) {
    streak++;
    cursor = addDaysToKey(cursor, -1);
  }
  return streak;
}

function computeLongestStreak(history: Record<string, string[]>): number {
  const activeDates = Object.entries(history)
    .filter(([, ids]) => ids.length > 0)
    .map(([key]) => key)
    .sort();
  let longest = 0;
  let run = 0;
  let prevKey: string | null = null;
  for (const key of activeDates) {
    run = prevKey && addDaysToKey(prevKey, 1) === key ? run + 1 : 1;
    longest = Math.max(longest, run);
    prevKey = key;
  }
  return longest;
}

export function useDerived(data: StoredData, screen: Screen) {
  return useMemo(() => {
    const today = todayKey();
    const builtIn: Quest[] = data.questMode === "full" ? QUESTS_FULL : [ONE_HOUR_QUEST];
    // Your own quests show in either mode — adding one is an explicit choice,
    // so one-hour mode stays the untouched default rather than a cap.
    const mine = data.customQuests.filter((q) => !q.archived);
    const questSet: Quest[] = [...builtIn, ...mine];
    const doneIds = new Set(data.history[today] ?? []);
    const quests: QuestVM[] = questSet.map((q) => ({
      ...q,
      on: doneIds.has(q.id),
      custom: q.id.startsWith("custom-"),
    }));
    const doneQ = quests.filter((q) => q.on);

    // Archived quests stay in the lookup so XP already earned still resolves.
    const questsById = new Map<string, Quest>([...BUILT_IN_QUESTS, ...data.customQuests.map((q) => [q.id, q] as const)]);

    let xp = 0;
    let totalCompletions = 0;
    for (const ids of Object.values(data.history)) {
      for (const id of ids) {
        const q = questsById.get(id);
        if (q) {
          xp += q.xp;
          totalCompletions++;
        }
      }
    }
    const level = 1 + Math.floor(xp / 700);
    const floor = (level - 1) * 700;
    const next = level * 700;
    const levelPct = next > floor ? Math.round(((xp - floor) / (next - floor)) * 100) : 0;

    const streak = computeCurrentStreak(data.history, today);
    const longest = computeLongestStreak(data.history);
    const fullModeUnlocked = data.fullModeUnlocked || streak >= FULL_MODE_UNLOCK_STREAK || longest >= FULL_MODE_UNLOCK_STREAK;

    const heat = buildHeatmap(data.history, data.startDate, today);
    const clearedCount = Object.values(data.cleared).filter(Boolean).length;
    const currentPhase = PHASES.find((p) => !data.cleared[p.n]) ?? PHASES[PHASES.length - 1];

    const dayNumber = daysBetween(data.startDate, today) + 1;
    const weekNumber = Math.min(20, Math.ceil(dayNumber / 7));

    const plannedHours = data.questMode === "onehour" ? 1 : 6;
    const remaining = questSet.length - doneQ.length;
    // In one-hour mode the focused hour is the actual bar, so the line keys off
    // that specifically — ticking a custom quest first shouldn't claim it's done.
    const hourDone = doneIds.has(ONE_HOUR_QUEST.id);
    const coachLine =
      data.questMode === "onehour"
        ? doneQ.length === 0
          ? "Nothing logged yet. One hour, whenever you can fit it — that's the entire bar today."
          : remaining === 0
            ? "Everything on today's list is done. That's the bar cleared — anything else is a bonus."
            : hourDone
              ? `Hour's in — the bar is cleared. ${remaining} of your own left if you want ${remaining === 1 ? "it" : "them"}.`
              : "Good start, but the focused hour is the one that actually moves the phase. Take it next."
        : doneQ.length === 0
          ? "Nothing checked yet. Open the project and do fifteen minutes — the rest of the day follows the first block, not your mood."
          : doneQ.length < 4
            ? "Two blocks in and it's still morning. DSA is the one you skip most, so take it next while you're warm."
            : doneQ.length < questSet.length
              ? "Strong day. Everything left is under an hour — finish the commit and the review, then stop guilt-free."
              : `Full green day, ${streak} in a row. Write tomorrow's first task down now, close the laptop, and let the streak do the motivating.`;

    const badges: Badge[] = [
      { name: "First blood", how: "Complete your first quest.", earned: totalCompletions >= 1 },
      { name: "Iron week", how: "Seven days in a row, ever.", earned: longest >= 7 },
      { name: "Typed", how: "Clear phase 01 — TypeScript.", earned: !!data.cleared["01"] },
      { name: "Pattern hunter", how: "Clear phase 04 — the DSA sprint.", earned: !!data.cleared["04"] },
      { name: "Deployed", how: "Clear phase 05 — AWS + shipping.", earned: !!data.cleared["05"] },
      { name: "Capstone shipped", how: "Clear all eight phases.", earned: clearedCount === PHASES.length },
    ];

    return {
      kicker: screen === "today" ? `Day ${dayNumber} · Week ${weekNumber} of 20` : SCREEN_TAGLINES[screen],
      title: SCREEN_TITLES[screen],
      quests,
      doneQ,
      questCount: questSet.length,
      doneCount: doneQ.length,
      todayPct: Math.round((doneQ.length / questSet.length) * 100),
      plannedHours,
      // Quests carry no duration, so this is planned hours scaled by how much
      // of the list is ticked — an estimate, not a timer.
      loggedHours: (questSet.length ? (doneQ.length / questSet.length) * plannedHours : 0).toFixed(1),
      freezes: FREEZE_TOKENS,
      streak,
      longest,
      xp,
      xpDisplay: xp.toLocaleString(),
      level,
      nextLevel: level + 1,
      levelTitle: LEVEL_TITLE,
      levelPct,
      xpToNext: next - xp,
      coachLine,
      heat,
      clearedCount,
      currentPhase,
      hoursTotal: HOURS_TOTAL,
      questMode: data.questMode,
      fullModeUnlocked,
      badges,
    };
  }, [data, screen]);
}
