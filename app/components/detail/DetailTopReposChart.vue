<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
// Chart.js is already registered by DetailYearlyChart on the same page,
// but calling register again is idempotent — safe to declare here too.
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps<{ topRepos: { name: string, count: number }[] }>()

const data = computed(() => ({
  labels: props.topRepos.map(r => r.name),
  datasets: [{
    label: 'Contributions',
    data: props.topRepos.map(r => r.count),
    backgroundColor: '#6366f1',
  }],
}))

const canvasHeight = computed(() => `${Math.max(200, props.topRepos.length * 28)}px`)
</script>

<template>
  <div
    id="section-top-repos"
    class="wof-detail-repos-chart"
    data-detail-section
  >
    <h3 class="puik-h3">
      Top repositories
    </h3>
    <div
      class="wof-detail-repos-chart__canvas"
      :style="{ height: canvasHeight }"
    >
      <Bar
        :data="data"
        :options="{
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
        }"
        aria-label="Top repositories par contributions sur la période"
      />
    </div>
  </div>
</template>

<style scoped>
.wof-detail-repos-chart {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
