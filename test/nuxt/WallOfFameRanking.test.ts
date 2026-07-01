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
})
