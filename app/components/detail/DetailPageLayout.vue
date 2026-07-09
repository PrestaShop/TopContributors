<script setup lang="ts">
defineSlots<{
  sidebar(): unknown
  main(): unknown
}>()
</script>

<template>
  <div class="wof-detail-page">
    <div class="wof-detail-page__container">
      <div class="wof-detail-page__sidebar-wrapper">
        <slot name="sidebar" />
      </div>
      <main class="wof-detail-page__main">
        <slot name="main" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.wof-detail-page {
  padding: 1rem;
  background: #f4f4f8;
  min-height: 100vh;
}
.wof-detail-page__container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1280px;
  margin: 0 auto;
}
.wof-detail-page__main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .wof-detail-page__container { flex-direction: row; }
  .wof-detail-page__sidebar-wrapper { width: 260px; flex-shrink: 0; }
  .wof-detail-page__sidebar-wrapper > * { position: sticky; top: 1rem; }
}
</style>
