import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { buildEntityDetail, companyMembers } from '@/composables/useEntityDetail'
import type { Company, Contributor, Period } from '@/types'

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

const company: Company = {
  rank: 24,
  name: 'Wepika',
  slug: 'wepika',
  merged_pull_requests: 3,
  merged_pull_requests_by_year: { 2021: 2, 2022: 1 },
  pull_requests_percent: 0.01,
  avatar_url: '',
  html_url: 'https://www.wepika.com',
  contributors: ['PrestaEdit'],
  employees: [],
}

describe('buildEntityDetail (company, PR-attribution scoped)', () => {
  it('uses the company own merged PR counters, never members lifetime stats', () => {
    const vm = buildEntityDetail(company, ref<Period>({ kind: 'sinceStart' }), 2026)
    expect(vm.entityType).toBe('company')
    expect(vm.kpis.mergedPr).toBe(3)
    expect(vm.kpis.openedPr).toBe(0)
    expect(vm.kpis.reviews).toBe(0)
    expect(vm.kpis.issues).toBe(0)
    expect(vm.yearlySeries.mergedPullRequests).toEqual({ 2021: 2, 2022: 1 })
    expect(vm.yearlySeries.reviews).toEqual({})
  })

  it('has no repos when traces does not provide per-company repositories', () => {
    const vm = buildEntityDetail(company, ref<Period>({ kind: 'sinceStart' }), 2026)
    expect(vm.repoRows).toEqual([])
    expect(vm.topRepos).toEqual([])
  })

  it('reads per-company repositories when traces provides them', () => {
    const withRepos: Company = {
      ...company,
      repositories: { PrestaShop: 2, docs: 1 },
      repositories_by_year: { PrestaShop: { 2021: 2 }, docs: { 2022: 1 } },
    }
    const vm = buildEntityDetail(withRepos, ref<Period>({ kind: 'thisYear' }), 2022)
    expect(vm.topRepos).toEqual([{ name: 'docs', count: 1 }])
    expect(vm.repoRows.map(r => r.name)).toEqual(['PrestaShop', 'docs'])
  })
})

describe('companyMembers', () => {
  it('falls back to PR-derived contributors when employees is an empty array', () => {
    expect(companyMembers(company)).toEqual(['PrestaEdit'])
  })

  it('prefers curated employees when present', () => {
    expect(companyMembers({ ...company, employees: [{ login: 'bob', time_frames: [] }] })).toEqual(['bob'])
  })
})
