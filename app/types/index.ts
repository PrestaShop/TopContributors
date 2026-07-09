export interface Company {
  rank: number
  name: string
  merged_pull_requests: number
  pull_requests_percent: number
  avatar_url: string
  html_url: string
  login?: string
  slug?: string
  contributors?: string[]
  merged_pull_requests_by_year?: Record<string, number>
  contributions?: number
  contributions_by_year?: Record<string, number>
  [key: string]: unknown
}

export interface Contributor {
  rank?: number
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string
  company: string | null
  blog: string | null
  location: string | null
  bio: string | null
  email_domain: string | null
  contributions: number
  mergedPullRequests: number
  repositories: Record<string, number>
  categories: Record<
    string,
    {
      total: number
      repositories: Record<string, number>
    }
  >
  reviews?: number
  issuesOpened?: number
  pullRequestsOpened?: number
  mergedPullRequestsByYear?: Record<string, number>
  pullRequestsOpenedByYear?: Record<string, number>
  reviewsByYear?: Record<string, number>
  issuesOpenedByYear?: Record<string, number>
  repositoriesByYear?: Record<string, Record<string, number>>
  [key: string]: unknown
}

export interface NewContributor {
  login: string
  name: string
  avatar_url: string
  html_url: string
  contributions: number
  firstContributionAt: string
}

export interface RankingEntry {
  rank: number
  login: string
  name: string
  avatar_url: string
  html_url: string
  count: number
  // Security ranking only: per-advisory credits split between research
  // (finder / reporter / analyst) and remediation (developer / reviewer /
  // verifier). `count` is the sum of both.
  research?: number
  remediation?: number
}

export interface Ranking {
  updatedAt: string
  items: RankingEntry[]
}

export type Counter = number | { total: number, byYear?: Record<string, number> }

export type Period
  = | { kind: 'sinceStart' }
    | { kind: 'lastYear' }
    | { kind: 'lastNYears', n: number }
