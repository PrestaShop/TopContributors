<script setup lang="ts">
import { computed } from 'vue'
import type { PuikTableHeader } from '@prestashopcorp/puik-components'
import type { Company, Contributor, RankingEntry } from '@/types'

type TableItem = Contributor | Company

const props = defineProps<{
  contributorsData: Contributor[]
  companiesData: Company[]
  reviewers: RankingEntry[]
  issues: RankingEntry[]
  pullRequests: RankingEntry[]
}>()

// CONTRIBUTORS TABLE CONFIG
const contributorsHeaders: PuikTableHeader[] = [
  {
    text: 'Rank',
    value: 'rank',
    size: 'sm',
    align: 'center',
    searchable: true,
    searchType: 'range',
    sortable: true,
  },
  { text: 'Name', value: 'name', size: 'lg', align: 'left', searchable: true, sortable: true },
  {
    text: 'Contributions',
    value: 'mergedPullRequests',
    size: 'sm',
    align: 'center',
    searchable: true,
    searchType: 'range',
    sortable: true,
  },
  { value: 'actions', size: 'sm', align: 'center', preventExpand: true, searchSubmit: true },
]

// COMPANIES TABLE CONFIG
const companiesHeaders: PuikTableHeader[] = [
  {
    text: 'Rank',
    value: 'rank',
    size: 'sm',
    align: 'center',
    searchable: true,
    searchType: 'range',
    sortable: true,
  },
  { text: 'Name', value: 'name', size: 'lg', align: 'left', searchable: true, sortable: true },
  {
    text: 'Contributions',
    value: 'merged_pull_requests',
    size: 'sm',
    align: 'center',
    searchable: true,
    searchType: 'range',
    sortable: true,
  },
  { value: 'actions', size: 'sm', align: 'center', preventExpand: true, searchSubmit: true },
]

const rankingHeaders = (countLabel: string): PuikTableHeader[] => [
  { text: 'Rank', value: 'rank', size: 'sm', align: 'center', searchable: true, searchType: 'range', sortable: true },
  { text: 'Name', value: 'name', size: 'lg', align: 'left', searchable: true, sortable: true },
  { text: countLabel, value: 'count', size: 'sm', align: 'center', searchable: true, searchType: 'range', sortable: true },
  { value: 'actions', size: 'sm', align: 'center', preventExpand: true, searchSubmit: true },
]

const contributorsRef = computed(() => props.contributorsData)

const { currentContributor, isModalOpen, openModal, closeModal }
  = useContributorModalRouter(contributorsRef)

const isContributor = (item: TableItem): item is Contributor => {
  return 'id' in item && 'mergedPullRequests' in item
}

const handleContributorAction = (item: TableItem) => {
  if (isContributor(item)) {
    openModal(item)
  }
}
</script>

<template>
  <section
    id="wof-all-contributors"
    class="wof-section wof-wall-of-fame-section"
  >
    <h2 class="puik-h2">
      🏆 PrestaShop Project's Wall of fame
    </h2>
    <p class="puik-body-default">
      The PrestaShop Wall of Fame: built by the best, committed to the core.
    </p>

    <puik-tab-navigation
      name="wall-of-fame-tables"
      :default-position="1"
    >
      <!-- eslint-disable-next-line vue/attribute-hyphenation -->
      <puik-tab-navigation-group-titles ariaLabel="Wall of Fame Tables Tabs">
        <puik-tab-navigation-title :position="1">
          Contributors
        </puik-tab-navigation-title>
        <puik-tab-navigation-title :position="2">
          Companies
        </puik-tab-navigation-title>
        <puik-tab-navigation-title :position="3">
          Reviewers
        </puik-tab-navigation-title>
        <puik-tab-navigation-title :position="4">
          Issue reporters
        </puik-tab-navigation-title>
        <puik-tab-navigation-title :position="5">
          PR authors
        </puik-tab-navigation-title>
      </puik-tab-navigation-group-titles>
      <puik-tab-navigation-group-panels>
        <puik-tab-navigation-panel :position="1">
          <WallOfFameTable
            :items="contributorsData"
            :headers="contributorsHeaders"
            type="contributor"
            @action-click="handleContributorAction"
          />
          <TopModal
            v-if="currentContributor"
            :contributor="currentContributor"
            :is-open="isModalOpen"
            @close="closeModal"
          />
        </puik-tab-navigation-panel>
        <puik-tab-navigation-panel :position="2">
          <WallOfFameTable
            :items="companiesData"
            :headers="companiesHeaders"
            type="company"
          />
        </puik-tab-navigation-panel>
        <puik-tab-navigation-panel :position="3">
          <WallOfFameTable
            :items="reviewers"
            :headers="rankingHeaders('Reviews')"
            type="ranking"
          />
        </puik-tab-navigation-panel>
        <puik-tab-navigation-panel :position="4">
          <WallOfFameTable
            :items="issues"
            :headers="rankingHeaders('Issues')"
            type="ranking"
          />
        </puik-tab-navigation-panel>
        <puik-tab-navigation-panel :position="5">
          <WallOfFameTable
            :items="pullRequests"
            :headers="rankingHeaders('Pull requests')"
            type="ranking"
          />
        </puik-tab-navigation-panel>
      </puik-tab-navigation-group-panels>
    </puik-tab-navigation>
  </section>
</template>

<style scoped>
.wof-wall-of-fame-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
#wall-of-fame-tables .puik-tab-navigation__title {
  border-bottom: none;
}
</style>
