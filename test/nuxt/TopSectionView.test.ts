import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TopSectionView from '@/components/sections/TopSectionView.vue'
import type { RankingEntry } from '@/types'

const ranking = (login: string): RankingEntry[] => [
  { rank: 1, login, name: login, avatar_url: 'https://a/1.png', html_url: `https://github.com/${login}`, count: 42 },
]

describe('TopSectionView', () => {
  it('renders the three new leaderboard titles', async () => {
    const component = await mountSuspended(TopSectionView, {
      props: {
        topContributors: [],
        topCompanies: [],
        topReviewers: ranking('rev'),
        topIssues: ranking('iss'),
        topPullRequests: ranking('pr'),
      },
    })
    const text = component.text()
    expect(text).toContain('Top reviewers')
    expect(text).toContain('Top issue reporters')
    expect(text).toContain('Top PR authors')
  })

  it('hides a leaderboard whose ranking is empty', async () => {
    const component = await mountSuspended(TopSectionView, {
      props: {
        topContributors: [],
        topCompanies: [],
        topReviewers: [],
        topIssues: [],
        topPullRequests: [],
      },
    })
    const text = component.text()
    expect(text).not.toContain('Top reviewers')
    expect(text).not.toContain('Top issue reporters')
    expect(text).not.toContain('Top PR authors')
  })
})
