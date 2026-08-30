import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { PuikTableHeader } from '@prestashopcorp/puik-components'
import WallOfFameTable from '@/components/WallOfFameTable.vue'
import type { RankingEntry } from '@/types'

const headers: PuikTableHeader[] = [
  { text: 'Rank', value: 'rank', size: 'sm', align: 'center' },
  { text: 'Name', value: 'name', size: 'lg', align: 'left' },
  { text: 'Reviews', value: 'count', size: 'sm', align: 'center' },
  { value: 'actions', size: 'sm', align: 'center' },
]
const items: RankingEntry[] = [
  { rank: 1, login: 'alice', name: 'Alice', avatar_url: 'https://a/1.png', html_url: 'https://github.com/alice', count: 312 },
]

describe('WallOfFameTable (ranking)', () => {
  it('renders a ranking row with count and GitHub link', async () => {
    const component = await mountSuspended(WallOfFameTable, {
      props: { items, headers, type: 'ranking' },
    })
    const text = component.text()
    expect(text).toContain('Alice')
    expect(text).toContain('312')
    const hrefs = component.findAll('a').map(a => a.attributes('href'))
    expect(hrefs).toContain('https://github.com/alice')
  })

  it('renders the security research and remediation counts via default cells', async () => {
    const securityHeaders: PuikTableHeader[] = [
      ...headers.slice(0, 3),
      { text: 'Research', value: 'research', size: 'sm', align: 'center' },
      { text: 'Fixes', value: 'remediation', size: 'sm', align: 'center' },
      headers[3]!,
    ]
    const securityItems: RankingEntry[] = [
      { rank: 1, login: 'carol', name: 'Carol', avatar_url: 'https://a/2.png', html_url: 'https://github.com/carol', count: 9, research: 6, remediation: 3 },
    ]
    const component = await mountSuspended(WallOfFameTable, {
      props: { items: securityItems, headers: securityHeaders, type: 'ranking' },
    })
    const text = component.text()
    expect(text).toContain('Carol')
    expect(text).toContain('9')
    expect(text).toContain('6')
    expect(text).toContain('3')
  })
})
