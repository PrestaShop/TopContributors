import type { Counter, Period } from '@/types'

export function pairCounter(total: number | undefined, byYear?: Record<string, number>): Counter {
  return byYear ? { total: total ?? 0, byYear } : (total ?? 0)
}

/**
 * Returns the max year present as a key across the provided year-maps, or
 * undefined if none of them contain data. Useful for anchoring the "last year"
 * period filter to the latest year actually present in the dataset (which may
 * lag behind the current calendar year when the traces snapshot is a few
 * months old).
 */
export function maxYearIn(...maps: (Record<string, number> | undefined)[]): number | undefined {
  let max = -Infinity
  for (const m of maps) {
    if (!m) continue
    for (const key of Object.keys(m)) {
      const y = Number(key)
      if (Number.isFinite(y) && y > max) max = y
    }
  }
  return Number.isFinite(max) ? max : undefined
}

export function sumCounter(
  c: Counter | undefined,
  period: Period,
  updatedYear: number,
): number {
  if (c == null) return 0
  if (typeof c === 'number') return c
  if (!c.byYear || period.kind === 'sinceStart') return c.total

  // Semantics anchored on `updatedYear`, which callers pass as the reference
  // year for the period computation. Callers typically pass the current
  // calendar year so `thisYear` / `lastYear` line up with the user's mental
  // model regardless of when the traces snapshot was generated.
  if (period.kind === 'thisYear') return c.byYear[String(updatedYear)] ?? 0
  if (period.kind === 'lastYear') return c.byYear[String(updatedYear - 1)] ?? 0

  // lastNYears rolling window ending at updatedYear (inclusive).
  const start = updatedYear - period.n + 1
  let sum = 0
  for (const [year, n] of Object.entries(c.byYear)) {
    const y = Number(year)
    if (y >= start && y <= updatedYear) sum += n
  }
  return sum
}
