<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { PuikTableHeader } from '@prestashopcorp/puik-components'
import { PuikPaginationVariants } from '@prestashopcorp/puik-components'
import type { Company, Contributor } from '@/types'

const props = defineProps<{
  title: string
  description?: string
  linkHref?: string
  linkContent?: string
  headers: PuikTableHeader[]
  items: Company[] | Contributor[]
  stickyLastCol?: boolean
  fullWidth?: boolean
}>()

defineEmits<{
  (e: 'view', item: Company | Contributor): void
  (e: 'action', payload: unknown): void
}>()

const page = ref(1)
const itemsPerPage = ref(5)
const paginationVariant = ref<PuikPaginationVariants>(PuikPaginationVariants.Large)

const paginatedItems = computed(() =>
  props.items.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value),
)

const updatePaginationVariant = () => {
  const width = window.innerWidth
  if (width < 768) {
    paginationVariant.value = PuikPaginationVariants.Mobile
  }
  else if (width < 1024) {
    paginationVariant.value = PuikPaginationVariants.Medium
  }
  else {
    paginationVariant.value = PuikPaginationVariants.Large
  }
}

let mobileMq: MediaQueryList
let tabletMq: MediaQueryList

onMounted(() => {
  updatePaginationVariant()
  mobileMq = window.matchMedia('(max-width: 767px)')
  tabletMq = window.matchMedia('(min-width: 768px) and (max-width: 1023px)')
  mobileMq.addEventListener('change', updatePaginationVariant)
  tabletMq.addEventListener('change', updatePaginationVariant)
})

onUnmounted(() => {
  mobileMq?.removeEventListener('change', updatePaginationVariant)
  tabletMq?.removeEventListener('change', updatePaginationVariant)
})
</script>

<template>
  <puik-card class="wof-top-card">
    <div class="wof-top-card__title-container">
      <h3 class="wof-top-card__title puik-h2">
        {{ title }}
      </h3>
      <puik-button
        v-if="linkContent && linkHref"
        variant="secondary"
        :aria-label="linkContent"
        class="wof-top-card__external-link"
      >
        <puik-link
          :href="linkHref"
          target="_self"
          :aria-label="linkContent"
        >
          {{ linkContent }}
        </puik-link>
      </puik-button>
    </div>
    <p
      v-if="description"
      class="wof-top-card__description puik-body-default"
    >
      {{ description }}
    </p>

    <puik-table
      v-if="items?.length"
      :headers="headers"
      :items="paginatedItems"
      :sticky-last-col="stickyLastCol"
      :full-width="fullWidth"
    >
      <template
        v-for="header in headers"
        :key="header.value"
        #[`item-${header.value}`]="slotProps"
      >
        <slot
          :name="`item-${header.value}`"
          v-bind="slotProps"
        >
          <span class="puik-body-default">{{ slotProps.item[header.value] }}</span>
        </slot>
      </template>
    </puik-table>

    <puik-pagination
      v-if="items?.length > itemsPerPage"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :variant="paginationVariant"
      :total-item="items.length"
      class="wof-top-card__pagination"
    />
  </puik-card>
</template>

<style>
:root {
  --wof-top-card-title-size-sm: 1.25rem;
}
.wof-top-card {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 100%;
  gap: 0 !important;
}
.wof-top-card__title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wof-top-card__title,
.wof-top-card__description,
.wof-top-card__external-link {
  margin-bottom: 1rem;
}
@media (max-width: 768px) {
  .wof-top-card__title {
    font-size: var(--wof-top-card-title-size-sm);
  }
}
.wof-top-card__pagination {
  align-self: center;
  margin-top: 1rem;
}
</style>
