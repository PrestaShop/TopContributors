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
  // Sourced from top_qa.json rather than contributors_prs.json (QA validations
  // are not per-contributor in the base dataset). Optional — companies and
  // contributors without QA activity omit it and the dataset stays hidden.
  qaByYear?: Record<string, number>
}>()

function inPeriod(y: number): boolean {
  if (props.period.kind === 'sinceStart') return true
  if (props.period.kind === 'thisYear') return y === props.updatedYear
  if (props.period.kind === 'lastYear') return y === props.updatedYear - 1
  return y >= props.updatedYear - props.period.n + 1 && y <= props.updatedYear
}

const hasQa = computed(() => !!props.qaByYear && Object.keys(props.qaByYear).length > 0)

const years = computed(() => {
  const set = new Set<string>([
    ...Object.keys(props.series.mergedPullRequests),
    ...Object.keys(props.series.reviews),
    ...Object.keys(props.series.issuesOpened),
    ...(props.qaByYear ? Object.keys(props.qaByYear) : []),
  ])
  return [...set].filter(y => inPeriod(Number(y))).sort()
})

const data = computed(() => ({
  labels: years.value,
  datasets: [
    {
      label: 'Merged PRs',
      data: years.value.map(y => props.series.mergedPullRequests[y] ?? 0),
      backgroundColor: '#6366f1',
    },
    {
      label: 'Reviews',
      data: years.value.map(y => props.series.reviews[y] ?? 0),
      backgroundColor: '#22c55e',
    },
    {
      label: 'Issues',
      data: years.value.map(y => props.series.issuesOpened[y] ?? 0),
      backgroundColor: '#f59e0b',
    },
    ...(hasQa.value
      ? [{
          label: 'QA validations',
          data: years.value.map(y => props.qaByYear?.[y] ?? 0),
          backgroundColor: '#a855f7',
        }]
      : []),
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
        aria-label="Contributions per year (merged, reviews, issues, QA)"
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
