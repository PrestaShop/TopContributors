import { describe, expect, it } from 'vitest'
import { sumCounter } from '@/composables/useCounter'

const updatedYear = 2026

describe('sumCounter', () => {
  it('returns 0 for null/undefined', () => {
    expect(sumCounter(undefined, { kind: 'sinceStart' }, updatedYear)).toBe(0)
  })

  it('returns the scalar as-is on legacy data regardless of period', () => {
    expect(sumCounter(42, { kind: 'sinceStart' }, updatedYear)).toBe(42)
    expect(sumCounter(42, { kind: 'lastYear' }, updatedYear)).toBe(42)
    expect(sumCounter(42, { kind: 'lastNYears', n: 3 }, updatedYear)).toBe(42)
  })

  it('returns total on sinceStart', () => {
    const c = { total: 100, byYear: { 2026: 10, 2025: 90 } }
    expect(sumCounter(c, { kind: 'sinceStart' }, updatedYear)).toBe(100)
  })

  it('returns byYear[updatedYear] on lastYear', () => {
    const c = { total: 100, byYear: { 2026: 10, 2025: 90 } }
    expect(sumCounter(c, { kind: 'lastYear' }, updatedYear)).toBe(10)
  })

  it('sums the rolling window on lastNYears', () => {
    const c = { total: 100, byYear: { 2026: 10, 2025: 30, 2024: 20, 2023: 40 } }
    expect(sumCounter(c, { kind: 'lastNYears', n: 3 }, updatedYear)).toBe(60)
  })

  it('falls back to total when byYear is missing', () => {
    const c = { total: 100 }
    expect(sumCounter(c, { kind: 'lastNYears', n: 3 }, updatedYear)).toBe(100)
  })

  it('ignores years outside the updatedYear range', () => {
    const c = { total: 100, byYear: { 2030: 5, 2026: 10, 2020: 85 } }
    expect(sumCounter(c, { kind: 'lastYear' }, updatedYear)).toBe(10)
  })
})
