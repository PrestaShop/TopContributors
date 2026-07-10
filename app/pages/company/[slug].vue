<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { usePeriod } from '@/composables/usePeriod'
import { useEntityDetail } from '@/composables/useEntityDetail'
import type { Company } from '@/types'

const route = useRoute()
const period = usePeriod()
const company = ref<Company | null>(null)
const updatedYear = ref<number>(new Date().getFullYear())
const loadError = ref<string | null>(null)

watchEffect(async () => {
  const slug = route.params.slug as string
  if (!slug) return
  try {
    const res = await fetch('/topcompanies_prs.json')
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    if (data.updatedAt) updatedYear.value = new Date(data.updatedAt).getUTCFullYear()
    // Case-insensitive slug match.
    const lower = slug.toLowerCase()
    const c = (data.companies ?? []).find((cc: Company) => cc.slug?.toLowerCase() === lower)
    company.value = c ?? null
    if (!company.value) loadError.value = `Company "${slug}" not found.`
    else loadError.value = null
  }
  catch (e) {
    loadError.value = 'Failed to load data.'
    console.error(e)
  }
})

const vm = useEntityDetail(company, period, updatedYear)
const yearsActive = computed(() => Object.keys(vm.value?.yearlySeries.mergedPullRequests ?? {}).length)
const isLegacyData = computed(() => company.value?.merged_pull_requests_by_year === undefined)

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
      >
        ← Back to all contributors
      </NuxtLink>
      <PeriodFilter />
      <span class="wof-detail-topbar__spacer" />
    </div>
    <PeriodFallbackBanner v-if="isLegacyData && company" />

    <DetailPageLayout v-if="vm && company">
      <template #sidebar>
        <DetailSidebar
          :avatar-url="company.avatar_url"
          :title="company.name"
          :subtitle="`${vm.members?.length ?? 0} contributors`"
          :sections="[
            { id: 'section-kpis', label: 'Overview' },
            { id: 'section-yearly', label: 'Contributions per year' },
            { id: 'section-donut', label: 'PR breakdown' },
          ]"
        />
      </template>
      <template #main>
        <DetailKpiRow
          :vm="vm"
          :years-active="yearsActive"
        />
        <div class="wof-detail-two-col">
          <DetailYearlyChart
            :series="vm.yearlySeries"
            :period="period"
            :updated-year="updatedYear"
          />
          <DetailPrDonut
            :merged="vm.prBreakdown.merged"
            :other="vm.prBreakdown.opened"
          />
        </div>
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
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #1d1d1b;
}
.wof-detail-back {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  justify-self: start;
}
.wof-detail-back:hover {
  background: rgba(255, 255, 255, 0.18);
}
.wof-detail-topbar__spacer {
  justify-self: end;
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
