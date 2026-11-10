import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DetailReposTable from '@/components/detail/DetailReposTable.vue'

const rows = [
  { name: 'PrestaShop', total: 2, byYear: {} },
  { name: 'example-modules', total: 1, byYear: {} },
]

describe('DetailReposTable — merged PRs links', () => {
  it('links each repository to the author merged PRs on GitHub when an author is given', async () => {
    const component = await mountSuspended(DetailReposTable, { props: { rows, authorLogin: 'PrestaEdit' } })

    const links = component.findAll('a.wof-detail-repos-table__link')
    expect(links.map(l => l.text())).toEqual(['PrestaShop', 'example-modules'])
    expect(links[0]!.attributes('href')).toBe(
      'https://github.com/PrestaShop/PrestaShop/pulls?q=is%3Apr+is%3Amerged+author%3APrestaEdit',
    )
    expect(links[0]!.attributes('target')).toBe('_blank')
    expect(links[0]!.attributes('rel')).toBe('noopener')
  })

  it('renders plain repository names without an author', async () => {
    const component = await mountSuspended(DetailReposTable, { props: { rows } })

    expect(component.findAll('a.wof-detail-repos-table__link')).toHaveLength(0)
    expect(component.text()).toContain('example-modules')
  })
})
