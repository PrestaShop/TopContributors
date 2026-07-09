import type { Counter, Period } from '@/types'

export function pairCounter(total: number | undefined, byYear?: Record<string, number>): Counter {
  return byYear ? { total: total ?? 0, byYear } : (total ?? 0)
}

export function sumCounter(
  c: Counter | undefined,
  period: Period,
  updatedYear: number,
): number {
  if (c == null) return 0
  if (typeof c === 'number') return c
  if (!c.byYear || period.kind === 'sinceStart') return c.total

  const start = period.kind === 'lastYear'
    ? updatedYear
    : updatedYear - period.n + 1

  let sum = 0
  for (const [year, n] of Object.entries(c.byYear)) {
    const y = Number(year)
    if (y >= start && y <= updatedYear) sum += n
  }
  return sum
}
