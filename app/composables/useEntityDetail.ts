import { computed, type Ref } from 'vue'
import type { Company, Contributor, Period } from '@/types'
import { pairCounter, sumCounter } from './useCounter'

export interface EntityDetailVM {
  kpis: {
    mergedPr: number
    openedPr: number
    reviews: number
    issues: number
    mergeRate: number // percent, 0 if openedPr==0
  }
  topRepos: { name: string, count: number }[]
  yearlySeries: {
    mergedPullRequests: Record<string, number>
    reviews: Record<string, number>
    issuesOpened: Record<string, number>
  }
  prBreakdown: { merged: number, opened: number }
  repoRows: { name: string, total: number, byYear: Record<string, number> }[]
  entityType: 'contributor' | 'company'
  members?: string[]
}

function isCompany(e: Contributor | Company): e is Company {
  return 'merged_pull_requests' in e
}

function readRepos(e: Contributor | Company): {
  scalars: Record<string, number>
  byYear: Record<string, Record<string, number>>
} {
  if (isCompany(e)) return { scalars: {}, byYear: {} }
  const c = e as Contributor
  return {
    scalars: (c.repositories ?? {}) as Record<string, number>,
    byYear: c.repositoriesByYear ?? {},
  }
}

export function buildEntityDetail(
  entity: Contributor | Company,
  period: Ref<Period>,
  updatedYear: number,
): EntityDetailVM {
  const p = period.value
  const c = entity as Contributor & Company

  const mergedPr = isCompany(entity)
    ? sumCounter(pairCounter(c.merged_pull_requests as number, c.merged_pull_requests_by_year), p, updatedYear)
    : sumCounter(pairCounter(c.mergedPullRequests as number, c.mergedPullRequestsByYear), p, updatedYear)

  // A raw Company entity carries no opened-PR data, so openedPr falls to 0 and
  // DetailKpiRow hides the merge-rate/opened tiles. For companies rendered
  // through the aggregated-contributor path, openedPr comes through as a real
  // number and both tiles show up.
  const openedPr = isCompany(entity)
    ? 0
    : sumCounter(pairCounter(c.pullRequestsOpened as number, c.pullRequestsOpenedByYear), p, updatedYear)

  const reviews = sumCounter(pairCounter(c.reviews as number, c.reviewsByYear), p, updatedYear)
  const issues = sumCounter(pairCounter(c.issuesOpened as number, c.issuesOpenedByYear), p, updatedYear)

  const { scalars: repoScalars, byYear: repoByYear } = readRepos(entity)
  const repoRows = Object.entries(repoScalars)
    .map(([name, total]) => ({ name, total, byYear: repoByYear[name] ?? {} }))
    .sort((a, b) => b.total - a.total)

  const topRepos = Object.entries(repoScalars)
    .map(([name, total]) => ({
      name,
      count: sumCounter(pairCounter(total, repoByYear[name]), p, updatedYear),
    }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  return {
    kpis: {
      mergedPr,
      openedPr,
      reviews,
      issues,
      mergeRate: openedPr === 0 ? 0 : Math.round((mergedPr * 100) / openedPr),
    },
    topRepos,
    yearlySeries: {
      mergedPullRequests: isCompany(entity)
        ? (c.merged_pull_requests_by_year ?? {})
        : (c.mergedPullRequestsByYear ?? {}),
      reviews: c.reviewsByYear ?? {},
      issuesOpened: c.issuesOpenedByYear ?? {},
    },
    prBreakdown: {
      merged: mergedPr,
      // openedPr is the TOTAL opened count; subtract merged to get "opened but
      // not merged". Clamp to 0 when there's no data (openedPr = 0) so the
      // donut renders a pure "merged" slice rather than negative-then-clamped.
      opened: openedPr === 0 ? 0 : Math.max(0, openedPr - mergedPr),
    },
    repoRows,
    entityType: isCompany(entity) ? 'company' : 'contributor',
    members: isCompany(entity) ? c.contributors : undefined,
  }
}

export function useEntityDetail(
  entity: Ref<Contributor | Company | null>,
  period: Ref<Period>,
  updatedYear: Ref<number>,
) {
  return computed<EntityDetailVM | null>(() =>
    entity.value ? buildEntityDetail(entity.value, period, updatedYear.value) : null,
  )
}

/**
 * Aggregates a list of contributors into a synthetic Contributor whose counters
 * are the sum of the members'. Used to render a company's detail page with the
 * same rich KPI/chart set as an individual contributor.
 *
 * The company's `merged_pull_requests(_by_year)` scalars are ignored here in
 * favour of the aggregate — traces already computes them from the same members,
 * so the two match. Reviews / issues / opened PRs are only available at member
 * level, so aggregation is the only way to surface them at company scope.
 */
export function aggregateContributors(
  company: Company,
  members: Contributor[],
): Contributor {
  const sumScalar = (key: 'mergedPullRequests' | 'pullRequestsOpened' | 'reviews' | 'issuesOpened' | 'contributions') =>
    members.reduce((s, m) => s + (typeof m[key] === 'number' ? (m[key] as number) : 0), 0)

  const sumByYear = (key: 'mergedPullRequestsByYear' | 'pullRequestsOpenedByYear' | 'reviewsByYear' | 'issuesOpenedByYear') => {
    const result: Record<string, number> = {}
    for (const m of members) {
      const map = m[key]
      if (!map) continue
      for (const [year, n] of Object.entries(map)) {
        result[year] = (result[year] ?? 0) + n
      }
    }
    return result
  }

  const sumRepos = () => {
    const result: Record<string, number> = {}
    for (const m of members) {
      for (const [repo, n] of Object.entries(m.repositories ?? {})) {
        result[repo] = (result[repo] ?? 0) + (n as number)
      }
    }
    return result
  }

  const sumReposByYear = () => {
    const result: Record<string, Record<string, number>> = {}
    for (const m of members) {
      const map = m.repositoriesByYear
      if (!map) continue
      for (const [repo, years] of Object.entries(map)) {
        result[repo] ??= {}
        for (const [year, n] of Object.entries(years)) {
          result[repo][year] = (result[repo][year] ?? 0) + n
        }
      }
    }
    return result
  }

  return {
    login: company.slug ?? company.name,
    id: 0,
    name: company.name,
    avatar_url: company.avatar_url,
    html_url: company.html_url,
    company: company.name,
    blog: null,
    location: null,
    bio: null,
    email_domain: null,
    contributions: sumScalar('contributions'),
    mergedPullRequests: sumScalar('mergedPullRequests'),
    mergedPullRequestsByYear: sumByYear('mergedPullRequestsByYear'),
    pullRequestsOpened: sumScalar('pullRequestsOpened'),
    pullRequestsOpenedByYear: sumByYear('pullRequestsOpenedByYear'),
    reviews: sumScalar('reviews'),
    reviewsByYear: sumByYear('reviewsByYear'),
    issuesOpened: sumScalar('issuesOpened'),
    issuesOpenedByYear: sumByYear('issuesOpenedByYear'),
    repositories: sumRepos(),
    repositoriesByYear: sumReposByYear(),
    categories: {},
  }
}
