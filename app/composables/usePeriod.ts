import { inject, provide, ref, watch, type InjectionKey, type Ref } from 'vue'
import type { Period } from '@/types'

export const PERIOD_KEY: InjectionKey<Ref<Period>> = Symbol('period')

const DEFAULT: Period = { kind: 'sinceStart' }

export function periodToParam(p: Period): string {
  if (p.kind === 'sinceStart') return 'all'
  if (p.kind === 'thisYear') return 'now'
  if (p.kind === 'lastYear') return '1y'
  return `${p.n}y`
}

export function parsePeriodParam(raw: string | null): Period {
  if (!raw || raw === 'all') return { kind: 'sinceStart' }
  if (raw === 'now') return { kind: 'thisYear' }
  if (raw === '1y') return { kind: 'lastYear' }
  const m = raw.match(/^(\d+)y$/)
  if (m) {
    const n = Number(m[1])
    if (n === 1) return { kind: 'lastYear' }
    if (n > 1 && n < 100) return { kind: 'lastNYears', n }
  }
  return { kind: 'sinceStart' }
}

export function providePeriod(): Ref<Period> {
  const initial = typeof window !== 'undefined'
    ? parsePeriodParam(new URL(window.location.href).searchParams.get('period'))
    : DEFAULT

  const period = ref<Period>(initial)

  if (typeof window !== 'undefined') {
    watch(period, (next) => {
      const url = new URL(window.location.href)
      const encoded = periodToParam(next)
      if (encoded === 'all') url.searchParams.delete('period')
      else url.searchParams.set('period', encoded)
      window.history.replaceState(null, '', url.toString())
    }, { deep: true })
  }

  provide(PERIOD_KEY, period)
  return period
}

export function usePeriod(): Ref<Period> {
  const p = inject(PERIOD_KEY)
  if (!p) throw new Error('usePeriod() called outside providePeriod()')
  return p
}
