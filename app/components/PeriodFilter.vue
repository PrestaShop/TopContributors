<script setup lang="ts">
import { computed } from 'vue'
import { usePeriod } from '@/composables/usePeriod'
import type { Period } from '@/types'

const period = usePeriod()

const OPTIONS: { key: Period['kind'], label: string, value: Period }[] = [
  { key: 'sinceStart', label: 'Since the beginning', value: { kind: 'sinceStart' } },
  { key: 'lastNYears', label: 'Last 3 years', value: { kind: 'lastNYears', n: 3 } },
  { key: 'lastYear', label: 'Last year', value: { kind: 'lastYear' } },
  { key: 'thisYear', label: 'This year', value: { kind: 'thisYear' } },
]

const activeIndex = computed(() => OPTIONS.findIndex(o => o.key === period.value.kind))

function select(idx: number): void {
  const opt = OPTIONS[(idx + OPTIONS.length) % OPTIONS.length]
  period.value = opt.value
}

function selectByKey(key: Period['kind']): void {
  const opt = OPTIONS.find(o => o.key === key)
  if (opt) period.value = opt.value
}

function onKey(e: KeyboardEvent): void {
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    select(activeIndex.value + 1)
  }
  else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    select(activeIndex.value - 1)
  }
}
</script>

<template>
  <div class="wof-period-filter">
    <div
      class="wof-period-filter__segmented"
      role="group"
      aria-label="Period filter"
    >
      <button
        v-for="(opt, idx) in OPTIONS"
        :key="opt.key"
        type="button"
        :aria-pressed="opt.key === period.kind ? 'true' : 'false'"
        class="wof-period-filter__btn"
        :class="{ 'wof-period-filter__btn--active': opt.key === period.kind }"
        @click="select(idx)"
        @keydown="onKey($event)"
      >
        {{ opt.label }}
      </button>
    </div>
    <select
      class="wof-period-filter__select"
      aria-label="Period filter"
      :value="period.kind"
      @change="selectByKey(($event.target as HTMLSelectElement).value as Period['kind'])"
    >
      <option
        v-for="opt in OPTIONS"
        :key="opt.key"
        :value="opt.key"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.wof-period-filter { min-width: 0; }
.wof-period-filter__segmented { display: none; }
.wof-period-filter__select {
  display: block;
  min-width: 0;
  max-width: 100%;
  padding: 0.4rem 2rem 0.4rem 0.9rem;
  border: 0;
  border-radius: 999px;
  background: #ececf5 url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231d1d1b' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>") no-repeat right 0.75rem center;
  font: inherit;
  color: #1d1d1b;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wof-period-filter__select:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }

@media (min-width: 768px) {
  .wof-period-filter__segmented { display: inline-flex; gap: 0.25rem; padding: 0.25rem; background: #ececf5; border-radius: 999px; }
  .wof-period-filter__select { display: none; }
}
.wof-period-filter__btn { padding: 0.4rem 0.9rem; border: 0; border-radius: 999px; background: transparent; cursor: pointer; font: inherit; white-space: nowrap; }
.wof-period-filter__btn--active { background: #1d1d1b; color: #fff; }
.wof-period-filter__btn:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }
</style>
