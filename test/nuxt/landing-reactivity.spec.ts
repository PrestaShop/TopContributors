// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { providePeriod } from '@/composables/usePeriod'
import TopRankingView from '@/components/sections/sub-sections/TopRankingView.vue'

const items = [
  { rank: 0, login: 'a', name: 'Alice', avatar_url: '', html_url: '', count: 10, countByYear: { 2026: 1, 2025: 9 } },
  { rank: 0, login: 'b', name: 'Bob', avatar_url: '', html_url: '', count: 5, countByYear: { 2026: 4, 2025: 1 } },
]

const Harness = defineComponent({
  props: ['periodKind'],
  setup(props) {
    const p = providePeriod()
    if (props.periodKind === 'lastYear') p.value = { kind: 'lastYear' }
    return () => h(TopRankingView, {
      title: 't', description: 'd', countLabel: 'Reviews', items, updatedYear: 2026,
    })
  },
})

describe('TopRankingView re-ranks on period', () => {
  it('sinceStart: Alice first (total 10)', async () => {
    const w = await mountSuspended(Harness, { props: { periodKind: 'sinceStart' } })
    expect(w.text()).toMatch(/Alice[\s\S]*Bob/)
  })
  it('lastYear: Bob first (2026 count 4 > 1)', async () => {
    const w = await mountSuspended(Harness, { props: { periodKind: 'lastYear' } })
    expect(w.text()).toMatch(/Bob[\s\S]*Alice/)
  })
})
