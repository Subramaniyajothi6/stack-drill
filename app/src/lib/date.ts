/** Local-date (not UTC) YYYY-MM-DD helpers. A "key" is always this format
 * and is the unit the storage layer indexes history by. */

export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toKey(new Date());
}

export function keyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDaysToKey(key: string, delta: number): string {
  const d = keyToDate(key);
  d.setDate(d.getDate() + delta);
  return toKey(d);
}

/** Days from `aKey` to `bKey` (positive when b is later than a). */
export function daysBetween(aKey: string, bKey: string): number {
  const a = keyToDate(aKey).getTime();
  const b = keyToDate(bKey).getTime();
  return Math.round((b - a) / 86400000);
}
