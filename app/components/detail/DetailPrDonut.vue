<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{ merged: number, other: number }>()

const data = computed(() => ({
  labels: ['Merged', 'Not merged'],
  datasets: [{
    data: [props.merged, props.other],
    backgroundColor: ['#22c55e', '#a78bfa'],
  }],
}))
</script>

<template>
  <div
    id="section-donut"
    class="wof-detail-donut"
    data-detail-section
  >
    <h3 class="puik-h3">
      Répartition des PR
    </h3>
    <div class="wof-detail-donut__canvas">
      <Doughnut
        :data="data"
        :options="{
          plugins: { legend: { position: 'bottom' } },
          responsive: true,
          maintainAspectRatio: false,
        }"
        aria-label="Répartition des PR mergés"
      />
    </div>
  </div>
</template>

<style scoped>
.wof-detail-donut {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
}
.wof-detail-donut__canvas {
  height: 220px;
}
</style>
