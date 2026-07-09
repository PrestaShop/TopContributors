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
    const c = (data.companies ?? []).find((cc: Company) => cc.slug === slug)
    company.value = c ?? null
    if (!company.value) loadError.value = `Société "${slug}" introuvable.`
    else loadError.value = null
  }
  catch (e) {
    loadError.value = 'Erreur de chargement des données.'
    console.error(e)
  }
})

const vm = useEntityDetail(company, period, updatedYear)
const yearsActive = computed(() => Object.keys(vm.value?.yearlySeries.mergedPullRequests ?? {}).length)

useHead(() => ({
  title: company.value?.name || 'Société',
  link: [{
    rel: 'canonical',
    href: `https://contributors.prestashop-project.org/company/${route.params.slug}`,
  }],
}))
</script>

<template>
  <div>
    <div class="wof-period-filter-wrapper">
      <PeriodFilter />
    </div>

    <DetailPageLayout v-if="vm && company">
      <template #sidebar>
        <DetailSidebar
          :avatar-url="company.avatar_url"
          :title="company.name"
          :subtitle="`${vm.members?.length ?? 0} contributeurs`"
          :sections="[
            { id: 'section-kpis', label: `Vue d'ensemble` },
            { id: 'section-yearly', label: 'Contributions par année' },
            { id: 'section-donut', label: 'Répartition des PR' },
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
        Retour à l'accueil
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.wof-period-filter-wrapper {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #1d1d1b;
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
