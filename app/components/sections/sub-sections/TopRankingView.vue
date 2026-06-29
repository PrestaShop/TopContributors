<script setup lang="ts">
import { ref } from 'vue'
import type { PuikTableHeader } from '@prestashopcorp/puik-components'
import type { RankingEntry } from '@/types'

const props = defineProps<{
  title: string
  description: string
  countLabel: string
  items: RankingEntry[]
}>()

const headers: PuikTableHeader[] = [
  { text: 'Rank', value: 'rank', size: 'sm', align: 'center', searchable: false },
  { text: 'Avatar', value: 'avatar', size: 'sm', align: 'center', searchable: false },
  { text: 'Name', value: 'name', size: 'md', align: 'left', searchable: true },
  { text: props.countLabel, value: 'count', size: 'sm', align: 'center', searchable: false },
  { value: 'actions', size: 'sm', align: 'center', preventExpand: true, searchSubmit: true },
]

const stickyLastCol = ref(false)
const fullWidth = ref(true)
</script>

<template>
  <TopCard
    :title="title"
    :description="description"
    :headers="headers"
    :items="items"
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
