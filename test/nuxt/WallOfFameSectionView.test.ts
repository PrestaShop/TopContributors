import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import WallOfFameSectionView from '@/components/sections/WallOfFameSectionView.vue'
import { providePeriod } from '@/composables/usePeriod'
import type { RankingEntry } from '@/types'

const ranking = (login: string): RankingEntry[] => [
  { rank: 1, login, name: login, avatar_url: 'https://a/1.png', html_url: `https://github.com/${login}`, count: 7 },
]

function withPeriod(props: Record<string, unknown>) {
  return defineComponent({
    setup() {
      providePeriod()
      return () => h(WallOfFameSectionView, props)
    },
  })
}

describe('WallOfFameSectionView', () => {
  // Note: puik-tab-navigation only renders the active tab's panel, so the
  // ranking tables (positions 3-5) are not mounted until their tab is opened —
  // asserting their content at the section level is impractical here. The
  // table rendering itself is covered by WallOfFameRanking.test.ts; this test
  // guards that the three ranking tabs are registered.
  it('renders the four new ranking tab titles', async () => {
    const component = await mountSuspended(withPeriod({
      contributorsData: [],
      companiesData: [],
      reviewers: ranking('rev'),
      issues: ranking('iss'),
      pullRequests: ranking('pr'),
      security: ranking('sec'),
      updatedYear: 2026,
    }))
    const text = component.text()
    expect(text).toContain('Reviewers')
    expect(text).toContain('Issue reporters')
    expect(text).toContain('PR authors')
    expect(text).toContain('Security')
  })

  it('hides the Security tab when no advisory data is available', async () => {
    const component = await mountSuspended(withPeriod({
      contributorsData: [],
      companiesData: [],
      reviewers: ranking('rev'),
      issues: ranking('iss'),
      pullRequests: ranking('pr'),
      security: [],
      updatedYear: 2026,
    }))
    expect(component.text()).not.toContain('Security')
  })
})
