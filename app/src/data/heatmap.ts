import { ACCENT, A100, A300, A500, A700 } from "./seed";
import { addDaysToKey, daysBetween } from "../lib/date";

export interface HeatDay {
  bg: string;
  title: string;
}

export interface HeatWeek {
  days: HeatDay[];
}

export interface HeatData {
  weeks: HeatWeek[];
  green: number;
  legend: { bg: string }[];
}

const STEPS = ["transparent", A100, A300, A500, ACCENT, A700];
const WINDOW_DAYS = 140;

function levelForCount(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 2;
  if (count === 2) return 3;
  if (count <= 4) return 4;
  return 5;
}

/** Builds the 20-week x 7-day grid ending today from real check-in history.
 * Days before `startDate` (the app's first run) render as untracked, not
 * "missed" — there's a real difference between the two. */
export function buildHeatmap(history: Record<string, string[]>, startDate: string, todayKey: string): HeatData {
  const firstKey = addDaysToKey(todayKey, -(WINDOW_DAYS - 1));
  const weeks: HeatWeek[] = [];
  let green = 0;
  let cursor = firstKey;

  for (let w = 0; w < 20; w++) {
    const days: HeatDay[] = [];
    for (let d = 0; d < 7; d++) {
      const beforeStart = daysBetween(cursor, startDate) > 0;
      const count = beforeStart ? 0 : (history[cursor] ?? []).length;
      const level = beforeStart ? 0 : levelForCount(count);
      if (level > 0) green++;
      const title = beforeStart
        ? "Before tracking started"
        : count > 0
          ? `${count} quest${count === 1 ? "" : "s"} done`
          : "Missed";
      days.push({ bg: STEPS[level], title });
      cursor = addDaysToKey(cursor, 1);
    }
    weeks.push({ days });
  }

  return { weeks, green, legend: STEPS.slice(1).map((s) => ({ bg: s })) };
}
