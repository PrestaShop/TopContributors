// @vitest-environment nuxt
import { describe, expect, it, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import PeriodFilter from '@/components/PeriodFilter.vue'
import { providePeriod } from '@/composables/usePeriod'

const Harness = defineComponent({
  components: { PeriodFilter },
  setup() {
    const p = providePeriod()
    return { p }
  },
  render() {
    // NB: refs returned from setup() are auto-unwrapped when accessed via
    // `this` in an Options API render(), so `this.p` here is already the
    // unwrapped Period value (not the Ref) - use `this.p.kind`, not `this.p.value.kind`.
    return h('div', [h(PeriodFilter), h('span', { class: 'kind' }, this.p.kind)])
  },
})

describe('PeriodFilter', () => {
  beforeEach(() => window.history.replaceState(null, '', '/'))

  it('renders three buttons and marks sinceStart as pressed by default', async () => {
    const w = await mountSuspended(Harness)
    const buttons = w.findAll('button')
    expect(buttons).toHaveLength(3)
    expect(buttons.find(b => b.attributes('aria-pressed') === 'true')?.text()).toContain('Depuis')
  })

  it('updates the shared period on click', async () => {
    const w = await mountSuspended(Harness)
    await w.findAll('button').at(1)!.trigger('click') // "3 dernières"
    expect(w.find('.kind').text()).toBe('lastNYears')
  })

  it('cycles selection on ArrowRight/ArrowLeft', async () => {
    const w = await mountSuspended(Harness)
    const btn = w.findAll('button').at(0)!
    await btn.trigger('keydown', { key: 'ArrowRight' })
    expect(w.find('.kind').text()).toBe('lastNYears')
    await btn.trigger('keydown', { key: 'ArrowRight' })
    expect(w.find('.kind').text()).toBe('lastYear')
    await btn.trigger('keydown', { key: 'ArrowLeft' })
    expect(w.find('.kind').text()).toBe('lastNYears')
  })
})
