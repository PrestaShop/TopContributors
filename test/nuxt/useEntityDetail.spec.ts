import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { buildEntityDetail } from '@/composables/useEntityDetail'
import type { Contributor, Period } from '@/types'

const contrib: Contributor = {
  login: 'alice',
  id: 1,
  avatar_url: '',
  html_url: '',
  name: 'Alice',
  company: null,
  blog: null,
  location: 'Paris',
  bio: null,
  email_domain: null,
  contributions: 0,
  mergedPullRequests: 100,
  mergedPullRequestsByYear: { 2026: 5, 2025: 20, 2024: 75 },
  pullRequestsOpened: 120,
  pullRequestsOpenedByYear: { 2026: 6, 2025: 25, 2024: 89 },
  reviews: 40,
  reviewsByYear: { 2026: 3, 2025: 12, 2024: 25 },
  issuesOpened: 15,
  issuesOpenedByYear: { 2026: 1, 2025: 4, 2024: 10 },
  repositories: { PrestaShop: 80, docs: 20 },
  repositoriesByYear: {
    PrestaShop: { 2026: 4, 2025: 15, 2024: 61 },
    docs: { 2026: 1, 2025: 5, 2024: 14 },
  },
  categories: {},
}

describe('buildEntityDetail (contributor, additive-strict)', () => {
  it('KPIs total on sinceStart', () => {
    const vm = buildEntityDetail(contrib, ref<Period>({ kind: 'sinceStart' }), 2026)
    expect(vm.kpis.mergedPr).toBe(100)
    expect(vm.kpis.reviews).toBe(40)
  })

  it('KPIs on thisYear (2026)', () => {
    const vm = buildEntityDetail(contrib, ref<Period>({ kind: 'thisYear' }), 2026)
    expect(vm.kpis.mergedPr).toBe(5)
    expect(vm.kpis.reviews).toBe(3)
  })

  it('KPIs on lastYear (calendar year - 1, so 2025 here)', () => {
    const vm = buildEntityDetail(contrib, ref<Period>({ kind: 'lastYear' }), 2026)
    expect(vm.kpis.mergedPr).toBe(20)
    expect(vm.kpis.reviews).toBe(12)
  })

  it('top repos sorted by period-filtered count', () => {
    const vm = buildEntityDetail(contrib, ref<Period>({ kind: 'thisYear' }), 2026)
    expect(vm.topRepos[0]).toEqual({ name: 'PrestaShop', count: 4 })
    expect(vm.topRepos[1]).toEqual({ name: 'docs', count: 1 })
  })

  it('yearlySeries preserves all years (unaffected by period)', () => {
    const vm = buildEntityDetail(contrib, ref<Period>({ kind: 'thisYear' }), 2026)
    expect(Object.keys(vm.yearlySeries.mergedPullRequests).sort()).toEqual(['2024', '2025', '2026'])
  })

  it('falls back to scalar total when *ByYear is missing (legacy JSON)', () => {
    const legacy: Contributor = { ...contrib, reviewsByYear: undefined, reviews: 40 }
    const vm = buildEntityDetail(legacy, ref<Period>({ kind: 'lastNYears', n: 3 }), 2026)
    expect(vm.kpis.reviews).toBe(40)
  })
})
