<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import type { Period } from '@/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps<{
  series: {
    mergedPullRequests: Record<string, number>
    reviews: Record<string, number>
    issuesOpened: Record<string, number>
  }
  period: Period
  updatedYear: number
}>()

const years = computed(() => {
  const set = new Set<string>([
    ...Object.keys(props.series.mergedPullRequests),
    ...Object.keys(props.series.reviews),
    ...Object.keys(props.series.issuesOpened),
  ])
  return [...set].sort()
})

function isActive(year: string): boolean {
  const y = Number(year)
  if (props.period.kind === 'sinceStart') return true
  if (props.period.kind === 'lastYear') return y === props.updatedYear
  return y >= props.updatedYear - props.period.n + 1 && y <= props.updatedYear
}

function color(base: string, active: boolean): string {
  return active ? base : base + '55'
}

const data = computed(() => ({
  labels: years.value,
  datasets: [
    {
      label: 'Merged PRs',
      data: years.value.map(y => props.series.mergedPullRequests[y] ?? 0),
      backgroundColor: years.value.map(y => color('#6366f1', isActive(y))),
    },
    {
      label: 'Reviews',
      data: years.value.map(y => props.series.reviews[y] ?? 0),
      backgroundColor: years.value.map(y => color('#22c55e', isActive(y))),
    },
    {
      label: 'Issues',
      data: years.value.map(y => props.series.issuesOpened[y] ?? 0),
      backgroundColor: years.value.map(y => color('#f59e0b', isActive(y))),
    },
  ],
}))
</script>

<template>
  <div
    id="section-yearly"
    class="wof-detail-yearly"
    data-detail-section
  >
    <h3 class="puik-h3">
      Contributions per year
    </h3>
    <div class="wof-detail-yearly__canvas">
      <Bar
        :data="data"
        :options="{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true },
          },
        }"
        aria-label="Contributions per year (merged, reviews, issues)"
      />
    </div>
  </div>
</template>

<style scoped>
.wof-detail-yearly {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
}
.wof-detail-yearly__canvas {
  height: 280px;
}
</style>
