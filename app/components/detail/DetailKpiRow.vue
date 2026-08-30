<script setup lang="ts">
import type { EntityDetailVM } from '@/composables/useEntityDetail'

defineProps<{ vm: EntityDetailVM, yearsActive: number, qaCount?: number }>()
</script>

<template>
  <div
    id="section-kpis"
    class="wof-detail-kpis"
    data-detail-section
  >
    <div class="wof-detail-kpi">
      <strong>{{ vm.kpis.mergedPr }}</strong>
      <span>Merged PRs</span>
    </div>
    <!-- Opened PRs / Merge rate only make sense when we actually have opened-PR
         data. Legacy scalar snapshots and edge-case entities (e.g. zero-activity
         contributors) get these tiles hidden rather than showing "0% Merge rate". -->
    <div
      v-if="vm.kpis.openedPr > 0"
      class="wof-detail-kpi"
    >
      <strong>{{ vm.kpis.openedPr }}</strong>
      <span>Opened PRs</span>
    </div>
    <div
      v-if="vm.kpis.openedPr > 0"
      class="wof-detail-kpi"
    >
      <strong>{{ vm.kpis.mergeRate }}%</strong>
      <span>Merge rate</span>
    </div>
    <div
      v-if="vm.entityType === 'company' && vm.members"
      class="wof-detail-kpi"
    >
      <strong>{{ vm.members.length }}</strong>
      <span>Contributors</span>
    </div>
    <div class="wof-detail-kpi">
      <strong>{{ vm.kpis.reviews }}</strong>
      <span>Reviews</span>
    </div>
    <div class="wof-detail-kpi">
      <strong>{{ vm.kpis.issues }}</strong>
      <span>Issues</span>
    </div>
    <div
      v-if="qaCount !== undefined && qaCount > 0"
      class="wof-detail-kpi"
    >
      <strong>{{ qaCount }}</strong>
      <span>QA validations</span>
    </div>
    <div class="wof-detail-kpi">
      <strong>{{ yearsActive }}</strong>
      <span>Years active</span>
    </div>
  </div>
</template>

<style scoped>
.wof-detail-kpis {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .wof-detail-kpis { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 1024px) {
  .wof-detail-kpis { grid-template-columns: repeat(6, 1fr); }
}
.wof-detail-kpi {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
}
.wof-detail-kpi strong {
  display: block;
  font-size: 1.75rem;
  color: #6366f1;
}
.wof-detail-kpi span {
  color: #5e5e5e;
}
</style>
