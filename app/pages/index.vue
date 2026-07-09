<script setup lang="ts">
import 'vue3-carousel/carousel.css'

import { ref, onMounted } from 'vue'
import type { Company, Contributor, NewContributor, RankingEntry } from '@/types'

const totalMergedPr = ref<number>(0)
const prestaMergedPrbyPercent = ref<number>(0)
const companiesData = ref<Company[]>([])
const contributorsData = ref<Contributor[]>([])
const topCompanies = ref<Company[]>([])
const topContributors = ref<Contributor[]>([])
const newContributors = ref<NewContributor[]>([])
const topReviewers = ref<RankingEntry[]>([])
const topIssues = ref<RankingEntry[]>([])
const topPullRequests = ref<RankingEntry[]>([])
const topSecurity = ref<RankingEntry[]>([])

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
    const total: number
      = data.companies.reduce(
        (acc: number, company: Company) => acc + company.merged_pull_requests,
        0,
      ) + data.community.merged_pull_requests
    totalMergedPr.value = total ?? 0

    const prestashopCompany = data.companies.find(
      (company: Company) => company.name === 'PrestaShop',
    )
    prestaMergedPrbyPercent.value = prestashopCompany.pull_requests_percent ?? 0
  }
  catch (error) {
    console.error('Error loading top companies:', error)
  }

  try {
    const response = await fetch('/contributors_prs.json')
    if (!response.ok) throw new Error('Error loading contributors data')

    const data = await response.json()

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
})
</script>

<template>
  <div class="wof-container">
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
      />
      <NewContributorsSectionView :new-contributors="newContributors" />
      <WallOfFameSectionView
        :contributors-data="contributorsData"
        :companies-data="companiesData"
        :reviewers="topReviewers"
        :issues="topIssues"
        :pull-requests="topPullRequests"
        :security="topSecurity"
      />
      <ContributeSectionView
        contribute-link="https://devdocs.prestashop-project.org/9/contribute/contribute-pull-requests/"
        slack-link="https://www.prestashop-project.org/slack/"
      />
    </main>
  </div>
</template>
