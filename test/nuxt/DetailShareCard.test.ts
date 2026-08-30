import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DetailShareCard from '@/components/detail/DetailShareCard.vue'

describe('DetailShareCard — ranking variants', () => {
  it('defaults to the overall variant and omits the query param for backwards compatibility', async () => {
    const component = await mountSuspended(DetailShareCard, { props: { login: 'alice' } })

    const url = (component.find('input[readonly]:not([value*="["])').element as HTMLInputElement).value
      || (component.findAll('input[readonly]').map(w => (w.element as HTMLInputElement).value).find(v => !v.startsWith('[')) ?? '')
    expect(url).toMatch(/\/card\/alice\.svg$/)
    expect(url).not.toContain('ranking=')

    const md = component.findAll('input[readonly]').map(w => (w.element as HTMLInputElement).value).find(v => v.startsWith('['))
    expect(md).toContain('/card/alice.svg')
    expect(md).not.toContain('ranking=')

    // Preview img mirrors the URL.
    expect(component.find('img').attributes('src')).toBe(url)

    // 5 variant chips, "Overall" active by default.
    const chips = component.findAll('[role="tab"]')
    expect(chips.map(c => c.text())).toEqual(['Overall', 'Top author', 'Top reviewer', 'Top QA', 'Top issues'])
    expect(chips[0]!.attributes('aria-selected')).toBe('true')
    expect(chips[0]!.classes()).toContain('is-active')
  })

  it.each([
    ['Top author', 'author'],
    ['Top reviewer', 'reviewer'],
    ['Top QA', 'qa'],
    ['Top issues', 'issues'],
  ] as const)('selecting %s appends ?ranking=%s to url, markdown, and preview', async (label, expected) => {
    const component = await mountSuspended(DetailShareCard, { props: { login: 'alice' } })

    const chip = component.findAll('[role="tab"]').find(c => c.text() === label)!
    await chip.trigger('click')

    const inputs = component.findAll('input[readonly]').map(w => (w.element as HTMLInputElement).value)
    const url = inputs.find(v => !v.startsWith('['))!
    const md = inputs.find(v => v.startsWith('['))!
    expect(url).toContain(`?ranking=${expected}`)
    expect(url).toMatch(new RegExp(`/card/alice\\.svg\\?ranking=${expected}$`))
    expect(md).toContain(`?ranking=${expected}`)
    expect(component.find('img').attributes('src')).toBe(url)

    // Chip reflects selection.
    expect(chip.attributes('aria-selected')).toBe('true')
    expect(chip.classes()).toContain('is-active')
  })

  it('switching back to Overall drops the query param again', async () => {
    const component = await mountSuspended(DetailShareCard, { props: { login: 'alice' } })
    const chips = component.findAll('[role="tab"]')

    await chips.find(c => c.text() === 'Top reviewer')!.trigger('click')
    let url = component.findAll('input[readonly]').map(w => (w.element as HTMLInputElement).value).find(v => !v.startsWith('['))!
    expect(url).toContain('?ranking=reviewer')

    await chips[0]!.trigger('click')
    url = component.findAll('input[readonly]').map(w => (w.element as HTMLInputElement).value).find(v => !v.startsWith('['))!
    expect(url).not.toContain('ranking=')
    expect(url).toMatch(/\/card\/alice\.svg$/)
  })
})
