<script setup lang="ts">
import { computed } from 'vue'
import type { PuikTableHeader } from '@prestashopcorp/puik-components'
import { usePeriod } from '@/composables/usePeriod'
import { pairCounter, sumCounter } from '@/composables/useCounter'
import type { Company, Contributor, RankingEntry } from '@/types'

type TableItem = Contributor | Company

const props = defineProps<{
  contributorsData: Contributor[]
  companiesData: Company[]
  reviewers: RankingEntry[]
  issues: RankingEntry[]
  pullRequests: RankingEntry[]
  security: RankingEntry[]
  updatedYear: number
}>()

const period = usePeriod()

function decorateByCount<T extends Record<string, unknown>>(
  list: T[],
  scalarKey: string,
  byYearKey: string,
): T[] {
  return list
    .map(it => ({
      ...it,
      [scalarKey]: sumCounter(
        pairCounter(it[scalarKey] as number, it[byYearKey] as Record<string, number> | undefined),
        period.value,
        props.updatedYear,
      ),
    }))
    .sort((a, b) => (b[scalarKey] as number) - (a[scalarKey] as number))
    .map((it, i) => ({ ...it, rank: i + 1 })) as T[]
}

const decoratedContributors = computed(() =>
  decorateByCount(props.contributorsData, 'mergedPullRequests', 'mergedPullRequestsByYear'),
)
const decoratedCompanies = computed(() =>
  decorateByCount(props.companiesData, 'merged_pull_requests', 'merged_pull_requests_by_year'),
)
const decoratedReviewers = computed(() =>
  decorateByCount(props.reviewers, 'count', 'countByYear'),
)
const decoratedIssues = computed(() =>
  decorateByCount(props.issues, 'count', 'countByYear'),
)
const decoratedPullRequests = computed(() =>
  decorateByCount(props.pullRequests, 'count', 'countByYear'),
)
const decoratedSecurity = computed(() => {
  return props.security
    .map((it) => {
      const c = it as unknown as {
        count: number
        countByYear?: Record<string, number>
        research?: number
        researchByYear?: Record<string, number>
        remediation?: number
        remediationByYear?: Record<string, number>
      }
      return {
        ...it,
        count: sumCounter(pairCounter(c.count, c.countByYear), period.value, props.updatedYear),
        research: sumCounter(pairCounter(c.research, c.researchByYear), period.value, props.updatedYear),
        remediation: sumCounter(pairCounter(c.remediation, c.remediationByYear), period.value, props.updatedYear),
      }
    })
    .sort((a, b) => b.count - a.count)
    .map((it, i) => ({ ...it, rank: i + 1 }))
})

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

// SECURITY TABLE CONFIG — Advisories is the total (sorted), then split
// between research credits (finder / reporter / analyst) and remediation
// credits (developer / reviewer / verifier).
const securityHeaders: PuikTableHeader[] = [
  { text: 'Rank', value: 'rank', size: 'sm', align: 'center', searchable: true, searchType: 'range', sortable: true },
  { text: 'Name', value: 'name', size: 'lg', align: 'left', searchable: true, sortable: true },
  { text: 'Advisories', value: 'count', size: 'sm', align: 'center', searchable: true, searchType: 'range', sortable: true },
  { text: 'Research', value: 'research', size: 'sm', align: 'center', searchable: true, searchType: 'range', sortable: true },
  { text: 'Fixes', value: 'remediation', size: 'sm', align: 'center', searchable: true, searchType: 'range', sortable: true },
  { value: 'actions', size: 'sm', align: 'center', preventExpand: true, searchSubmit: true },
]

const { currentContributor, isModalOpen, openModal, closeModal }
  = useContributorModalRouter(decoratedContributors)

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
        <puik-tab-navigation-title
          v-if="security.length"
          :position="6"
        >
          Security
        </puik-tab-navigation-title>
      </puik-tab-navigation-group-titles>
      <puik-tab-navigation-group-panels>
        <puik-tab-navigation-panel :position="1">
          <WallOfFameTable
            :items="decoratedContributors"
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
            :items="decoratedCompanies"
            :headers="companiesHeaders"
            type="company"
          />
        </puik-tab-navigation-panel>
        <puik-tab-navigation-panel :position="3">
          <WallOfFameTable
            :items="decoratedReviewers"
            :headers="rankingHeaders('Reviews')"
            type="ranking"
          />
        </puik-tab-navigation-panel>
        <puik-tab-navigation-panel :position="4">
          <WallOfFameTable
            :items="decoratedIssues"
            :headers="rankingHeaders('Issues')"
            type="ranking"
          />
        </puik-tab-navigation-panel>
        <puik-tab-navigation-panel :position="5">
          <WallOfFameTable
            :items="decoratedPullRequests"
            :headers="rankingHeaders('Pull requests')"
            type="ranking"
          />
        </puik-tab-navigation-panel>
        <puik-tab-navigation-panel
          v-if="security.length"
          :position="6"
        >
          <WallOfFameTable
            :items="decoratedSecurity"
            :headers="securityHeaders"
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
