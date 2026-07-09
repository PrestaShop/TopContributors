<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PuikTableHeader } from '@prestashopcorp/puik-components'
import type { Company } from '@/types'
import { usePeriod } from '@/composables/usePeriod'
import { pairCounter, sumCounter } from '@/composables/useCounter'

const props = defineProps<{
  topCompanies: Company[]
  updatedYear: number
}>()

const headers: PuikTableHeader[] = [
  {
    text: 'Rank',
    value: 'rank',
    size: 'sm',
    align: 'center',
    searchable: false,
  },
  {
    text: 'Logo',
    value: 'logo',
    size: 'sm',
    align: 'center',
    searchable: false,
  },
  {
    text: 'Name',
    value: 'name',
    size: 'md',
    align: 'left',
    searchable: true,
  },
  {
    text: 'Contributions',
    value: 'merged_pull_requests',
    size: 'sm',
    align: 'center',
    searchable: false,
  },
  {
    value: 'actions',
    size: 'sm',
    align: 'center',
    preventExpand: true,
    searchSubmit: true,
  },
]
const stickyLastCol = ref(false)
const fullWidth = ref(true)

const period = usePeriod()

const decoratedItems = computed(() =>
  props.topCompanies
    .map(item => ({
      ...item,
      merged_pull_requests: sumCounter(
        pairCounter(
          item.merged_pull_requests,
          (item as unknown as { merged_pull_requests_by_year?: Record<string, number> }).merged_pull_requests_by_year,
        ),
        period.value,
        props.updatedYear,
      ),
    }))
    .sort((a, b) => b.merged_pull_requests - a.merged_pull_requests)
    .map((it, i) => ({ ...it, rank: i + 1 })),
)
</script>

<template>
  <TopCard
    title="🚀 Top companies"
    description="Meet the top companies who are helping us strengthen PrestaShop."
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

    <template #item-logo="{ item }">
      <puik-avatar
        v-if="item.avatar_url"
        size="large"
        type="photo"
        :src="item.avatar_url"
      />
      <puik-avatar
        v-else
        size="large"
        :first-name="item.name"
        :single-initial="false"
      />
    </template>

    <template #item-name="{ item }">
      <div class="wof-top-contributors__name">
        <span
          v-if="item.login"
          class="puik-body-default"
        >
          {{ item.login }}
        </span>
        <span
          v-else-if="item.name"
          class="puik-body-default"
        >
          {{ item.name }}
        </span>
      </div>
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
