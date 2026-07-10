// @vitest-environment nuxt
import { describe, expect, it, beforeEach } from 'vitest'
import { providePeriod, PERIOD_KEY } from '@/composables/usePeriod'
import { inject, defineComponent, h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'

describe('usePeriod', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('defaults to sinceStart', async () => {
    const Consumer = defineComponent({
      setup() {
        const p = inject(PERIOD_KEY)
        return () => h('div', p?.value.kind ?? 'none')
      },
    })
    const Wrapper = defineComponent({
      setup() {
        providePeriod()
        return () => h(Consumer)
      },
    })
    const w = await mountSuspended(Wrapper)
    expect(w.text()).toBe('sinceStart')
  })

  it('reads ?period=3y from URL at mount', async () => {
    const Consumer = defineComponent({
      setup() {
        const p = inject(PERIOD_KEY)
        return () => h('div', JSON.stringify(p?.value))
      },
    })
    const Wrapper = defineComponent({
      setup() {
        providePeriod()
        return () => h(Consumer)
      },
    })
    // @nuxt/test-utils' mountSuspended installs its own router and navigates
    // to "/" (or the given `route` option) before `setup()` runs, so the URL
    // must be set via this option rather than `window.history.replaceState`
    // beforehand (which gets overwritten by the router navigation).
    const w = await mountSuspended(Wrapper, { route: '/?period=3y' })
    expect(w.text()).toContain('lastNYears')
    expect(w.text()).toContain('"n":3')
  })

  it('reads ?period=1y as lastYear', async () => {
    const Consumer = defineComponent({
      setup() {
        const p = inject(PERIOD_KEY)
        return () => h('div', JSON.stringify(p?.value))
      },
    })
    const Wrapper = defineComponent({
      setup() {
        providePeriod()
        return () => h(Consumer)
      },
    })
    const w = await mountSuspended(Wrapper, { route: '/?period=1y' })
    expect(w.text()).toContain('lastYear')
  })
})
