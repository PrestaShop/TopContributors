<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { usePeriod } from '@/composables/usePeriod'
import { useEntityDetail } from '@/composables/useEntityDetail'
import type { Contributor } from '@/types'

const route = useRoute()
const period = usePeriod()
const contributor = ref<Contributor | null>(null)
const updatedYear = ref<number>(new Date().getFullYear())
const loadError = ref<string | null>(null)

watchEffect(async () => {
  const login = route.params.login as string
  if (!login) return
  try {
    const res = await fetch('/contributors_prs.json')
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    if (data.updatedAt) updatedYear.value = new Date(data.updatedAt).getUTCFullYear()
    const c = data[login] as Contributor | undefined
    contributor.value = (c && typeof c === 'object' && 'login' in c) ? c : null
    if (!contributor.value) loadError.value = `Contributeur "${login}" introuvable.`
    else loadError.value = null
  }
  catch (e) {
    loadError.value = 'Erreur de chargement des données.'
    console.error(e)
  }
})

const vm = useEntityDetail(contributor, period, updatedYear)
const yearsActive = computed(() => Object.keys(vm.value?.yearlySeries.mergedPullRequests ?? {}).length)
const isLegacyData = computed(() => contributor.value?.mergedPullRequestsByYear === undefined)

useHead(() => ({
  title: contributor.value?.name || contributor.value?.login || 'Contributeur',
  link: [{
    rel: 'canonical',
    href: `https://contributors.prestashop-project.org/contributor/${route.params.login}`,
  }],
}))
</script>

<template>
  <div>
    <div class="wof-period-filter-wrapper">
      <PeriodFilter />
    </div>
    <PeriodFallbackBanner v-if="isLegacyData && contributor" />

    <DetailPageLayout v-if="vm && contributor">
      <template #sidebar>
        <DetailSidebar
          :avatar-url="contributor.avatar_url"
          :title="contributor.name || contributor.login"
          :subtitle="`@${contributor.login}`"
          :tags="contributor.company ? [contributor.company] : []"
          :infos="[
            ...(contributor.location ? [{ icon: 'location_on', label: 'Location', value: contributor.location }] : []),
            { icon: 'link', label: 'GitHub', value: contributor.html_url, href: contributor.html_url },
            ...(contributor.blog ? [{ icon: 'desktop_mac', label: 'Website', value: contributor.blog, href: contributor.blog }] : []),
          ]"
          :sections="[
            { id: 'section-kpis', label: `Vue d'ensemble` },
            { id: 'section-yearly', label: 'Contributions par année' },
            { id: 'section-donut', label: 'Répartition des PR' },
            { id: 'section-top-repos', label: 'Top repositories' },
            { id: 'section-year-detail', label: 'Détail par année' },
            { id: 'section-repos-table', label: 'Tous les repos' },
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
        <DetailTopReposChart :top-repos="vm.topRepos" />
        <DetailYearTabs :series="vm.yearlySeries" />
        <DetailReposTable :rows="vm.repoRows" />
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
