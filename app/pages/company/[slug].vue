<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { usePeriod } from '@/composables/usePeriod'
import { aggregateContributors, useEntityDetail } from '@/composables/useEntityDetail'
import type { Company, Contributor } from '@/types'

const route = useRoute()
const period = usePeriod()
const company = ref<Company | null>(null)
const contributorsData = ref<Record<string, Contributor>>({})
const updatedYear = ref<number>(new Date().getFullYear())
const loadError = ref<string | null>(null)

watchEffect(async () => {
  const slug = route.params.slug as string
  if (!slug) return
  try {
    const [companiesRes, contributorsRes] = await Promise.all([
      fetch('/topcompanies_prs.json'),
      fetch('/contributors_prs.json'),
    ])
    if (!companiesRes.ok) throw new Error(String(companiesRes.status))
    const companiesJson = await companiesRes.json()
    if (companiesJson.updatedAt) updatedYear.value = new Date(companiesJson.updatedAt).getUTCFullYear()

    const lower = slug.toLowerCase()
    const c = (companiesJson.companies ?? []).find((cc: Company) => cc.slug?.toLowerCase() === lower)
    company.value = c ?? null
    if (!company.value) {
      loadError.value = `Company "${slug}" not found.`
      return
    }
    loadError.value = null

    if (contributorsRes.ok) {
      contributorsData.value = await contributorsRes.json()
    }
  }
  catch (e) {
    loadError.value = 'Failed to load data.'
    console.error(e)
  }
})

// Build a synthetic Contributor from the company's member logins so the whole
// contributor-detail toolkit (KPIs, charts, tabs, repos table) applies to a
// company aggregate without any per-entity forking downstream.
const members = computed<Contributor[]>(() => {
  const c = company.value
  if (!c?.contributors) return []
  return c.contributors
    .map(login => contributorsData.value[login])
    .filter((m): m is Contributor => m != null && typeof m === 'object' && 'login' in m)
})

const aggregated = computed<Contributor | null>(() =>
  company.value && members.value.length ? aggregateContributors(company.value, members.value) : null,
)

const vm = useEntityDetail(aggregated, period, updatedYear)

// Preserve the company entity type + members list downstream — the
// aggregate is a Contributor shape so useEntityDetail defaults to
// entityType='contributor'; overwrite so the KPI row + members section render
// their company-specific bits.
const companyVm = computed(() => {
  if (!vm.value || !company.value) return null
  return {
    ...vm.value,
    entityType: 'company' as const,
    members: company.value.contributors ?? [],
  }
})

const yearsActive = computed(() => Object.keys(companyVm.value?.yearlySeries.mergedPullRequests ?? {}).length)
const isLegacyData = computed(() => {
  const c = company.value
  if (!c) return false
  return c.merged_pull_requests_by_year === undefined
    && c.contributions_by_year === undefined
})

useHead(() => ({
  title: company.value?.name || 'Company',
  link: [{
    rel: 'canonical',
    href: `https://contributors.prestashop-project.org/company/${company.value?.slug ?? route.params.slug}`,
  }],
}))
</script>

<template>
  <div>
    <div class="wof-detail-topbar">
      <NuxtLink
        to="/"
        class="wof-detail-back"
        aria-label="Back to all contributors"
      >
        <span class="wof-detail-back__short">← Back</span>
        <span class="wof-detail-back__long">← Back to all contributors</span>
      </NuxtLink>
      <div class="wof-detail-topbar__filter">
        <PeriodFilter />
      </div>
      <span class="wof-detail-topbar__spacer" />
    </div>
    <PeriodFallbackBanner v-if="isLegacyData && company" />

    <DetailPageLayout v-if="companyVm && company">
      <template #sidebar>
        <DetailSidebar
          :avatar-url="company.avatar_url"
          :title="company.name"
          :subtitle="`${companyVm.members?.length ?? 0} contributors`"
          :infos="company.html_url
            ? [{ icon: 'link', label: 'GitHub', value: company.html_url, href: company.html_url }]
            : []"
          :sections="[
            { id: 'section-kpis', label: 'Overview' },
            { id: 'section-yearly', label: 'Contributions per year' },
            { id: 'section-donut', label: 'PR breakdown' },
            { id: 'section-top-repos', label: 'Top repositories' },
            { id: 'section-year-detail', label: 'Year drilldown' },
            { id: 'section-repos-table', label: 'All repos' },
            { id: 'section-members', label: 'Contributors' },
          ]"
        />
      </template>
      <template #main>
        <DetailKpiRow
          :vm="companyVm"
          :years-active="yearsActive"
        />
        <div class="wof-detail-two-col">
          <DetailYearlyChart
            :series="companyVm.yearlySeries"
            :period="period"
            :updated-year="updatedYear"
          />
          <DetailPrDonut
            :merged="companyVm.prBreakdown.merged"
            :other="companyVm.prBreakdown.opened"
          />
        </div>
        <DetailTopReposChart :top-repos="companyVm.topRepos" />
        <DetailYearTabs :series="companyVm.yearlySeries" />
        <DetailReposTable :rows="companyVm.repoRows" />
        <DetailMembersList :members="members" />
      </template>
    </DetailPageLayout>

    <div
      v-else-if="loadError"
      class="wof-detail-error"
    >
      <p>{{ loadError }}</p>
      <NuxtLink to="/">
        Back to home
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.wof-detail-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #1d1d1b;
}
.wof-detail-back {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  white-space: nowrap;
}
.wof-detail-back:hover {
  background: rgba(255, 255, 255, 0.18);
}
.wof-detail-back__long { display: none; }
@media (min-width: 768px) {
  .wof-detail-back__short { display: none; }
  .wof-detail-back__long { display: inline; }
}
.wof-detail-topbar__filter {
  min-width: 0;
  flex-shrink: 1;
}
.wof-detail-topbar__spacer {
  display: none;
}
@media (min-width: 768px) {
  .wof-detail-topbar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    padding: 1rem;
  }
  .wof-detail-back { justify-self: start; }
  .wof-detail-topbar__filter { justify-self: center; }
  .wof-detail-topbar__spacer { display: block; justify-self: end; }
}
.wof-detail-two-col {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .wof-detail-two-col { grid-template-columns: 2fr 1fr; }
}
.wof-detail-error {
  padding: 4rem 1rem;
  text-align: center;
}
</style>
