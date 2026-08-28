<script setup lang="ts">
import 'vue3-carousel/carousel.css'

import { ref, computed, onMounted } from 'vue'
import { usePeriod } from '@/composables/usePeriod'
import { pairCounter, sumCounter } from '@/composables/useCounter'
import type { Company, Contributor, NewContributor, RankingEntry, Counter } from '@/types'

const period = usePeriod()
const updatedYear = ref<number>(new Date().getFullYear())
const communityCounter = ref<Counter | undefined>()
const companiesData = ref<Company[]>([])
const contributorsData = ref<Contributor[]>([])
const topCompanies = ref<Company[]>([])
const topContributors = ref<Contributor[]>([])
const newContributors = ref<NewContributor[]>([])
const topReviewers = ref<RankingEntry[]>([])
const topIssues = ref<RankingEntry[]>([])
const topPullRequests = ref<RankingEntry[]>([])
const topSecurity = ref<RankingEntry[]>([])
const topQa = ref<RankingEntry[]>([])

const totalMergedPr = computed<number>(() => {
  const cs = companiesData.value
  if (!cs.length) return 0
  return cs.reduce(
    (acc, cc) => acc + sumCounter(
      pairCounter(cc.merged_pull_requests as number, (cc as unknown as { merged_pull_requests_by_year?: Record<string, number> }).merged_pull_requests_by_year),
      period.value,
      updatedYear.value,
    ),
    0,
  ) + sumCounter(communityCounter.value, period.value, updatedYear.value)
})

const isLegacyData = computed(() => {
  // Fresh data is signalled by ANY contributor exposing a byYear sibling map
  // (or the aggregated community counter carrying one). Contributors with zero
  // merged PRs legitimately lack the map, so a small sample can produce false
  // positives — hence the wide sample plus the community fallback.
  const sample = contributorsData.value.slice(0, 50)
  if (!sample.length) return false
  if (sample.some(c => c.mergedPullRequestsByYear !== undefined)) return false
  const community = communityCounter.value
  if (community && typeof community !== 'number' && community.byYear) return false
  return true
})

const prestaMergedPrbyPercent = computed<number>(() => {
  const total = totalMergedPr.value
  if (!total) return 0
  const presta = companiesData.value.find(c => c.name === 'PrestaShop')
  if (!presta) return 0
  const prestaCount = sumCounter(
    pairCounter(presta.merged_pull_requests as number, (presta as unknown as { merged_pull_requests_by_year?: Record<string, number> }).merged_pull_requests_by_year),
    period.value,
    updatedYear.value,
  )
  return Number((prestaCount * 100 / total).toFixed(2))
})

onMounted(async () => {
  try {
    const response = await fetch('/newcontributors.json')
    if (!response.ok) throw new Error('Error loading new contributors')
    const data: Record<string, NewContributor> = await response.json()
    newContributors.value = Object.values(data)
  }
  catch (error) {
    console.error('Error loading new contributors:', error)
  }

  try {
    const response = await fetch('/topcompanies_prs.json')
    if (!response.ok) throw new Error('Error loading top companies')
    const data = await response.json()

    companiesData.value = data.companies
    topCompanies.value = data.companies
    communityCounter.value = pairCounter(
      data.community?.merged_pull_requests,
      data.community?.merged_pull_requests_by_year,
    )
  }
  catch (error) {
    console.error('Error loading top companies:', error)
  }

  try {
    const response = await fetch('/contributors_prs.json')
    if (!response.ok) throw new Error('Error loading contributors data')

    const data = await response.json()

    if (data.updatedAt) updatedYear.value = new Date(data.updatedAt).getUTCFullYear()

    // Filter out non-contributor entries and nulls (e.g., "updatedAt") from the JSON object
    const contributorsOnly = Object.values(data).filter(
      (item): item is Contributor =>
        item !== null && typeof item === 'object' && 'contributions' in item,
    )
    contributorsOnly.map((contributor, index) => {
      contributor.rank = index + 1
      return contributor
    })
    contributorsData.value = contributorsOnly
    topContributors.value = contributorsOnly
  }
  catch (error) {
    console.error('Error loading contributors data:', error)
  }

  try {
    const response = await fetch('/top_reviewers.json')
    if (!response.ok) throw new Error('Error loading top reviewers')
    const data = await response.json()
    topReviewers.value = data.items ?? []
  }
  catch (error) {
    console.error('Error loading top reviewers:', error)
  }

  try {
    const response = await fetch('/top_issues.json')
    if (!response.ok) throw new Error('Error loading top issues')
    const data = await response.json()
    topIssues.value = data.items ?? []
  }
  catch (error) {
    console.error('Error loading top issues:', error)
  }

  try {
    const response = await fetch('/top_pullrequests.json')
    if (!response.ok) throw new Error('Error loading top pull requests')
    const data = await response.json()
    topPullRequests.value = data.items ?? []
  }
  catch (error) {
    console.error('Error loading top pull requests:', error)
  }

  try {
    const response = await fetch('/top_security.json')
    if (!response.ok) throw new Error('Error loading top security')
    const data = await response.json()
    topSecurity.value = data.items ?? []
  }
  catch (error) {
    console.error('Error loading top security:', error)
  }

  try {
    const response = await fetch('/top_qa.json')
    if (!response.ok) throw new Error('Error loading top QA')
    const data = await response.json()
    topQa.value = data.items ?? []
  }
  catch (error) {
    console.error('Error loading top QA:', error)
  }
})
</script>

<template>
  <div class="wof-container">
    <div class="wof-period-filter-wrapper">
      <PeriodFilter />
    </div>
    <PeriodFallbackBanner v-if="isLegacyData" />
    <HeaderSectionView
      :total-merged-pr="totalMergedPr"
      :presta-merged-pr-by-percent="prestaMergedPrbyPercent"
    />
    <main>
      <TopSectionView
        :top-contributors="topContributors"
        :top-companies="topCompanies"
        :top-reviewers="topReviewers"
        :top-issues="topIssues"
        :top-pull-requests="topPullRequests"
        :top-security="topSecurity"
        :top-qa="topQa"
        :updated-year="updatedYear"
      />
      <NewContributorsSectionView :new-contributors="newContributors" />
      <WallOfFameSectionView
        :contributors-data="contributorsData"
        :companies-data="companiesData"
        :reviewers="topReviewers"
        :issues="topIssues"
        :pull-requests="topPullRequests"
        :security="topSecurity"
        :qa="topQa"
        :updated-year="updatedYear"
      />
      <ContributeSectionView
        contribute-link="https://devdocs.prestashop-project.org/9/contribute/contribute-pull-requests/"
        slack-link="https://www.prestashop-project.org/slack/"
      />
    </main>
  </div>
</template>

<style scoped>
.wof-period-filter-wrapper {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #1d1d1b;
}
</style>
