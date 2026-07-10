import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import TopRankingView from '@/components/sections/sub-sections/TopRankingView.vue'
import { providePeriod } from '@/composables/usePeriod'
import type { RankingEntry } from '@/types'

const items: RankingEntry[] = [
  { rank: 1, login: 'alice', name: 'Alice', avatar_url: 'https://a/1.png', html_url: 'https://github.com/alice', count: 312 },
  { rank: 2, login: 'bob', name: 'Bob', avatar_url: 'https://a/2.png', html_url: 'https://github.com/bob', count: 120 },
]

function withPeriod(props: Record<string, unknown>) {
  return defineComponent({
    setup() {
      providePeriod()
      return () => h(TopRankingView, props)
    },
  })
}

describe('TopRankingView', () => {
  it('renders the title, each entry and its count', async () => {
    const component = await mountSuspended(withPeriod({ title: '👀 Top reviewers', description: 'desc', countLabel: 'Reviews', items, updatedYear: 2026 }))
    const text = component.text()
    expect(text).toContain('👀 Top reviewers')
    expect(text).toContain('Alice')
    expect(text).toContain('312')
    expect(text).toContain('Bob')
    expect(text).toContain('120')
  })

  it('links each entry to its GitHub profile', async () => {
    const component = await mountSuspended(withPeriod({ title: 'T', description: 'd', countLabel: 'Reviews', items, updatedYear: 2026 }))
    const hrefs = component.findAll('a').map(a => a.attributes('href'))
    expect(hrefs).toContain('https://github.com/alice')
    expect(hrefs).toContain('https://github.com/bob')
  })

  it('gives ranks 1-3 their medal classes', async () => {
    const component = await mountSuspended(withPeriod({ title: 'T', description: 'd', countLabel: 'Reviews', items, updatedYear: 2026 }))
    expect(component.find('.wof-top-section__rank--first').exists()).toBe(true)
    expect(component.find('.wof-top-section__rank--second').exists()).toBe(true)
  })

  it('renders extra numeric columns (research / remediation) when provided', async () => {
    const securityItems: RankingEntry[] = [
      { rank: 1, login: 'carol', name: 'Carol', avatar_url: 'https://a/3.png', html_url: 'https://github.com/carol', count: 9, research: 6, remediation: 3 },
    ]
    const component = await mountSuspended(withPeriod({
      title: '🛡️ Top security contributors', description: 'd', countLabel: 'Advisories',
      items: securityItems,
      updatedYear: 2026,
      extraColumns: [
        { label: 'Research', value: 'research' },
        { label: 'Fixes', value: 'remediation' },
      ],
    }))
    const text = component.text()
    expect(text).toContain('Research')
    expect(text).toContain('Fixes')
    expect(text).toContain('9')
    expect(text).toContain('6')
    expect(text).toContain('3')
  })
})
