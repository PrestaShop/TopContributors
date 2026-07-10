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

  // Companies don't track opened PRs separately; consumers rendering
  // mergeRate or prBreakdown.opened should suppress them when entityType==='company'
  // (both would otherwise show as 100% / 0 for every company).
  const openedPr = isCompany(entity)
    ? mergedPr
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
      opened: Math.max(0, openedPr - mergedPr),
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
