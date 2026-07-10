<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  series: {
    mergedPullRequests: Record<string, number>
    reviews: Record<string, number>
    issuesOpened: Record<string, number>
  }
}>()

const years = computed(() => {
  const set = new Set<string>([
    ...Object.keys(props.series.mergedPullRequests),
    ...Object.keys(props.series.reviews),
    ...Object.keys(props.series.issuesOpened),
  ])
  return [...set].sort((a, b) => Number(b) - Number(a))
})

const selectedYear = ref<string>(years.value[0] ?? '')

// Reconcile selectedYear if the parent provides years asynchronously (fetch
// completes after mount) or navigates to a different entity whose year set
// no longer contains the previously selected value.
watch(years, (ys) => {
  if (!ys.includes(selectedYear.value)) selectedYear.value = ys[0] ?? ''
})
</script>

<template>
  <div
    id="section-year-detail"
    class="wof-detail-year-tabs"
    data-detail-section
  >
    <h3 class="puik-h3">
      Year drilldown
    </h3>
    <div
      class="wof-detail-year-tabs__tabs"
      role="tablist"
    >
      <button
        v-for="y in years"
        :key="y"
        role="tab"
        :aria-selected="y === selectedYear"
        :class="{ 'wof-detail-year-tabs__tab--active': y === selectedYear }"
        class="wof-detail-year-tabs__tab"
        @click="selectedYear = y"
      >
        {{ y }}
      </button>
    </div>
    <div
      class="wof-detail-year-tabs__panel"
      role="tabpanel"
    >
      <div class="wof-detail-year-tabs__kpi">
        <strong>{{ series.mergedPullRequests[selectedYear] ?? 0 }}</strong>
        Merged PRs
      </div>
      <div class="wof-detail-year-tabs__kpi">
        <strong>{{ series.reviews[selectedYear] ?? 0 }}</strong>
        Reviews
      </div>
      <div class="wof-detail-year-tabs__kpi">
        <strong>{{ series.issuesOpened[selectedYear] ?? 0 }}</strong>
        Issues
      </div>
    </div>
  </div>
</template>

<style scoped>
.wof-detail-year-tabs {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
}
.wof-detail-year-tabs__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 1rem;
}
.wof-detail-year-tabs__tab {
  border: 0;
  background: #ececf5;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
}
.wof-detail-year-tabs__tab--active {
  background: #1d1d1b;
  color: #fff;
}
.wof-detail-year-tabs__panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
.wof-detail-year-tabs__kpi {
  text-align: center;
}
.wof-detail-year-tabs__kpi strong {
  display: block;
  font-size: 1.5rem;
  color: #6366f1;
}
</style>
