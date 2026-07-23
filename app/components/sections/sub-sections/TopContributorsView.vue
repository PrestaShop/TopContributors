<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PuikTableHeader } from '@prestashopcorp/puik-components'
import type { Contributor } from '@/types'
import { usePeriod } from '@/composables/usePeriod'
import { pairCounter, sumCounter } from '@/composables/useCounter'

const props = defineProps<{
  topContributors: Contributor[]
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
    text: 'Avatar',
    value: 'avatar',
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
    value: 'mergedPullRequests',
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
  props.topContributors
    .map(item => ({
      ...item,
      mergedPullRequests: sumCounter(
        pairCounter(
          item.mergedPullRequests,
          (item as unknown as { mergedPullRequestsByYear?: Record<string, number> }).mergedPullRequestsByYear,
        ),
        period.value,
        props.updatedYear,
      ),
    }))
    .sort((a, b) => b.mergedPullRequests - a.mergedPullRequests)
    .map((it, i) => ({ ...it, rank: i + 1 })),
)

const { currentContributor, isModalOpen, openModal, closeModal } = useContributorModalRouter(
  decoratedItems,
)
</script>

<template>
  <TopCard
    title="🔥 Top contributors"
    description="These experts spent hours improving PrestaShop's quality."
    link-content="View all"
    link-href="#wof-all-contributors"
    :headers="headers"
    :items="decoratedItems"
    :sticky-last-col="stickyLastCol"
    :full-width="fullWidth"
    @view="openModal"
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
        <span
          v-if="item.name"
          class="puik-body-default"
        >{{ item.name }}</span>
        <span
          v-else-if="item.login"
          class="puik-body-default"
        >
          {{ item.login }}
        </span>
        <puik-tag
          v-if="item.company"
          :content="item.company"
          variant="blue"
        />
      </div>
    </template>

    <template #item-actions="{ item }">
      <div class="wof-top-actions">
        <a
          :href="item.html_url as string"
          target="_blank"
          :aria-label="`Open ${item.login} GitHub profile in a new tab`"
          rel="noopener noreferrer"
        >
          <puik-button
            variant="text"
            force-legacy-text-variant
            right-icon="open_in_new"
            :aria-label="`Open ${item.login} GitHub profile in a new tab`"
          >
            <span class="sr-only">{{ item.login }}</span>
          </puik-button>
        </a>
        <NuxtLink
          :to="`/contributor/${(item.login as string).toLowerCase()}`"
          aria-label="View contributor detail"
        >
          <puik-button
            variant="text"
            force-legacy-text-variant
            right-icon="insights"
            aria-label="View contributor detail"
          />
        </NuxtLink>
      </div>
    </template>
  </TopCard>

  <TopModal
    v-if="currentContributor"
    :contributor="currentContributor"
    :is-open="isModalOpen"
    @close="closeModal"
  />
</template>
