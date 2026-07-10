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
    // Case-insensitive lookup: GitHub logins preserve case in the JSON keys but
    // are case-insensitive at the API level, so accept any casing in the URL.
    let c = data[login] as Contributor | undefined
    if (!c) {
      const lower = login.toLowerCase()
      const matchKey = Object.keys(data).find(k => k.toLowerCase() === lower)
      if (matchKey) c = data[matchKey] as Contributor
    }
    contributor.value = (c && typeof c === 'object' && 'login' in c) ? c : null
    if (!contributor.value) loadError.value = `Contributor "${login}" not found.`
    else {
      loadError.value = null
      // Canonicalise URL to lowercase login. Uses replace() so it doesn't leave
      // a history entry, then the back button still lands on the previous page.
      if (import.meta.client && login !== login.toLowerCase()) {
        useRouter().replace(`/contributor/${login.toLowerCase()}`)
      }
    }
  }
  catch (e) {
    loadError.value = 'Failed to load data.'
    console.error(e)
  }
})

const vm = useEntityDetail(contributor, period, updatedYear)
const yearsActive = computed(() => Object.keys(vm.value?.yearlySeries.mergedPullRequests ?? {}).length)
const isLegacyData = computed(() => contributor.value?.mergedPullRequestsByYear === undefined)

useHead(() => ({
  title: contributor.value?.name || contributor.value?.login || 'Contributor',
  link: [{
    rel: 'canonical',
    href: `https://contributors.prestashop-project.org/contributor/${contributor.value?.login ?? route.params.login}`,
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
            { id: 'section-kpis', label: 'Overview' },
            { id: 'section-yearly', label: 'Contributions per year' },
            { id: 'section-donut', label: 'PR breakdown' },
            { id: 'section-top-repos', label: 'Top repositories' },
            { id: 'section-year-detail', label: 'Year drilldown' },
            { id: 'section-repos-table', label: 'All repos' },
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
