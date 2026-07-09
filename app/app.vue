<script setup lang="ts">
import { providePeriod } from '@/composables/usePeriod'

providePeriod()
</script>

<template>
  <NuxtPage />
</template>

<style>
:root {
  --wof-section-gap: 1.5rem;
  --wof-section-padding: 2.5rem 1rem;
  --wof-section-padding-lg: 4rem;
  --wof-avatar-bg: #fff;
  --wof-jumbotron-size-sm: 2.5rem;
  --wof-h1-size-sm: 1.75rem;
}

.wof-section {
  padding: var(--wof-section-padding);
  display: flex;
  flex-direction: column;
  gap: var(--wof-section-gap);
}
@media (min-width: 768px) {
  .wof-section {
    padding: var(--wof-section-padding-lg);
  }
}
.puik-tag p {
  margin-bottom: 0;
}
a.puik-button:hover {
  text-decoration: none;
}
.puik-avatar.puik-avatar--photo {
  background-color: var(--wof-avatar-bg);
}
@media (max-width: 768px) {
  .puik-brand-jumbotron {
    font-size: var(--wof-jumbotron-size-sm);
  }
  .puik-h1 {
    font-size: var(--wof-h1-size-sm);
  }
}
.wof-top-contributors__name {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.puik-modal__dialogPanelContainer {
  overflow: auto;
}
.puik-modal__dialogPanelContainer__dialogPanel {
  min-height: max-content;
  margin: auto;
  margin-top: 0.5rem;
}
.puik-modal__dialogPanelContainer {
  align-items: flex-start;
}
.puik-modal--large .puik-modal__dialogPanelContainer__dialogPanel {
  @media (width >= 40rem) {
    max-width: 1024px;
  }
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
</style>
