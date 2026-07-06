import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TopSectionView from '@/components/sections/TopSectionView.vue'
import type { RankingEntry } from '@/types'

const ranking = (login: string): RankingEntry[] => [
  { rank: 1, login, name: login, avatar_url: 'https://a/1.png', html_url: `https://github.com/${login}`, count: 42 },
]

describe('TopSectionView', () => {
  it('renders the four new leaderboard titles', async () => {
    const component = await mountSuspended(TopSectionView, {
      props: {
        topContributors: [],
        topCompanies: [],
        topReviewers: ranking('rev'),
        topIssues: ranking('iss'),
        topPullRequests: ranking('pr'),
        topSecurity: ranking('sec'),
      },
    })
    const text = component.text()
    expect(text).toContain('Top reviewers')
    expect(text).toContain('Top issue reporters')
    expect(text).toContain('Top PR authors')
    expect(text).toContain('Top security researchers')
  })

  it('hides a leaderboard whose ranking is empty', async () => {
    const component = await mountSuspended(TopSectionView, {
      props: {
        topContributors: [],
        topCompanies: [],
        topReviewers: [],
        topIssues: [],
        topPullRequests: [],
        topSecurity: [],
      },
    })
    const text = component.text()
    expect(text).not.toContain('Top reviewers')
    expect(text).not.toContain('Top issue reporters')
    expect(text).not.toContain('Top PR authors')
    expect(text).not.toContain('Top security researchers')
  })

  it('lists every entry (no cap), like the other Top tables', async () => {
    const many = (login: string): RankingEntry[] =>
      Array.from({ length: 60 }, (_, i) => ({
        rank: i + 1, login: `${login}${i}`, name: `${login}${i}`,
        avatar_url: 'https://a/1.png', html_url: `https://github.com/${login}${i}`, count: 60 - i,
      }))
    const component = await mountSuspended(TopSectionView, {
      props: {
        topContributors: [], topCompanies: [],
        topReviewers: many('rev'), topIssues: many('iss'), topPullRequests: many('pr'),
        topSecurity: many('sec'),
      },
    })
    // TopCard shows "<total> result(s)" from the items length — the full 60, not a capped subset
    expect(component.text()).toContain('60 result(s)')
    expect(component.text()).not.toContain('50 result(s)')
  })
})
