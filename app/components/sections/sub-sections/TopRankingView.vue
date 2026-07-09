<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PuikTableHeader } from '@prestashopcorp/puik-components'
import type { RankingEntry } from '@/types'
import { usePeriod } from '@/composables/usePeriod'
import { pairCounter, sumCounter } from '@/composables/useCounter'

type ItemInput = RankingEntry & {
  count: number
  countByYear?: Record<string, number>
  research?: number
  researchByYear?: Record<string, number>
  remediation?: number
  remediationByYear?: Record<string, number>
}

const props = defineProps<{
  title: string
  description: string
  countLabel: string
  items: ItemInput[]
  updatedYear: number
  // Optional breakdown columns rendered between the total and the actions
  // cell. Their values come from RankingEntry's extra numeric fields (e.g.
  // `research`, `remediation` for the security ranking).
  extraColumns?: { label: string, value: string }[]
}>()

const headers: PuikTableHeader[] = [
  { text: 'Rank', value: 'rank', size: 'sm', align: 'center', searchable: false },
  { text: 'Avatar', value: 'avatar', size: 'sm', align: 'center', searchable: false },
  { text: 'Name', value: 'name', size: 'md', align: 'left', searchable: true },
  { text: props.countLabel, value: 'count', size: 'sm', align: 'center', searchable: false },
  ...(props.extraColumns ?? []).map(c => ({ text: c.label, value: c.value, size: 'sm' as const, align: 'center' as const, searchable: false })),
  { value: 'actions', size: 'sm', align: 'center', preventExpand: true, searchSubmit: true },
]

const period = usePeriod()

const decoratedItems = computed(() => {
  return props.items
    .map((it) => {
      const decorated = {
        ...it,
        count: sumCounter(pairCounter(it.count, it.countByYear), period.value, props.updatedYear),
      }
      if (it.research !== undefined || it.researchByYear !== undefined) {
        decorated.research = sumCounter(pairCounter(it.research, it.researchByYear), period.value, props.updatedYear)
      }
      if (it.remediation !== undefined || it.remediationByYear !== undefined) {
        decorated.remediation = sumCounter(pairCounter(it.remediation, it.remediationByYear), period.value, props.updatedYear)
      }
      return decorated
    })
    .sort((a, b) => b.count - a.count)
    .map((it, i) => ({ ...it, rank: i + 1 }))
})

const stickyLastCol = ref(false)
const fullWidth = ref(true)
</script>

<template>
  <TopCard
    :title="title"
    :description="description"
    :headers="headers"
    :items="decoratedItems"
    :sticky-last-col="stickyLastCol"
    :full-width="fullWidth"
  >
    <template #item-rank="{ item }">
      <div
        :class="[
          'wof-top-section__rank',
          { 'wof-top-section__rank--first': item.rank === 1 },
          { 'wof-top-section__rank--second': item.rank === 2 },
          { 'wof-top-section__rank--third': item.rank === 3 },
        ]"
      >
        <span class="puik-body-default-bold">{{ item.rank }}</span>
      </div>
    </template>

    <template #item-avatar="{ item }">
      <puik-avatar
        size="large"
        type="photo"
        :src="item.avatar_url"
      />
    </template>

    <template #item-name="{ item }">
      <div class="wof-top-contributors__name">
        <span class="puik-body-default">{{ item.name || item.login }}</span>
      </div>
    </template>

    <template #item-count="{ item }">
      <span class="puik-body-default-bold">{{ item.count }}</span>
    </template>

    <template #item-actions="{ item }">
      <a
        :href="item.html_url"
        target="_blank"
        aria-label="view profile"
        rel="noopener noreferrer"
      >
        <puik-button
          variant="text"
          force-legacy-text-variant
          right-icon="visibility"
          aria-label="view profile icon"
        />
      </a>
    </template>
  </TopCard>
</template>
