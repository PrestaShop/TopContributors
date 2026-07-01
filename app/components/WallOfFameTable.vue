<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { PuikTableHeader, searchOption, sortOption } from '@prestashopcorp/puik-components'
import { PuikPaginationVariants } from '@prestashopcorp/puik-components'
import type { Company, Contributor, RankingEntry } from '@/types'

type TableType = 'contributor' | 'company' | 'ranking'
type TableItem = Contributor | Company | RankingEntry

const props = defineProps<{
  items: TableItem[]
  headers: PuikTableHeader[]
  type: TableType
}>()

const emit = defineEmits<{
  (e: 'action-click', item: TableItem): void
}>()

const stickyLastCol = ref(false)
const fullWidth = ref(true)

const itemsRef = ref<TableItem[]>([...props.items])
const page = ref(1)
const itemsPerPage = ref(5)
const paginationVariant = ref<PuikPaginationVariants>(PuikPaginationVariants.Large)

// PAGINATION
const paginatedItems = computed(() =>
  itemsRef.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value),
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
  window.addEventListener('resize', updatePaginationVariant)
})

onUnmounted(() => {
  mobileMq?.removeEventListener('change', updatePaginationVariant)
  tabletMq?.removeEventListener('change', updatePaginationVariant)
  window.removeEventListener('resize', updatePaginationVariant)
})

// SEARCH
const handleSearchSubmit = (payload: searchOption[]) => {
  let filtered = [...props.items]

  payload.forEach(({ searchBy, inputText, inputRange }) => {
    if (inputText) {
      const search = inputText.toLowerCase().trim().replace(/\s+/g, ' ')
      filtered = filtered.filter((item) => {
        const typedItem = item as Record<string, unknown>
        const haystack
          = searchBy === 'name'
            ? `${(typedItem.name as string) ?? ''} ${(typedItem.login as string) ?? ''}`.toLowerCase()
            : String(typedItem[searchBy]).toLowerCase()
        return haystack.includes(search)
      })
    }

    if (inputRange) {
      filtered = filtered.filter((item) => {
        const typedItem = item as Record<string, unknown>
        const value = typedItem[searchBy] as number
        if (inputRange.min != null && value < inputRange.min) return false
        if (inputRange.max != null && value > inputRange.max) return false
        return true
      })
    }
  })

  itemsRef.value = payload.length ? filtered : [...props.items]
  page.value = 1
}

// SORT
const handleSort = (payload: sortOption) => {
  const { sortBy, sortOrder } = payload

  if (!sortBy) return

  itemsRef.value = [...itemsRef.value].sort((a, b) => {
    const typedA = a as Record<string, unknown>
    const typedB = b as Record<string, unknown>
    const valA
      = sortBy === 'name'
        ? ((typedA.name as string) || (typedA.login as string) || '').toLowerCase()
        : typedA[sortBy]
    const valB
      = sortBy === 'name'
        ? ((typedB.name as string) || (typedB.login as string) || '').toLowerCase()
        : typedB[sortBy]

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'ASC' ? valA - valB : valB - valA
    }
    return sortOrder === 'ASC'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA))
  })

  page.value = 1
}

watch(
  () => props.items,
  (newVal) => {
    if (newVal) itemsRef.value = [...newVal]
  },
  { immediate: true },
)

const handleActionClick = (item: TableItem) => {
  emit('action-click', item)
}

const isContributor = (_item: TableItem): _item is Contributor => {
  return props.type === 'contributor'
}

const isCompany = (_item: TableItem): _item is Company => {
  return props.type === 'company'
}

const isRanking = (item: TableItem): item is RankingEntry => {
  return props.type === 'ranking' && 'count' in item
}
</script>

<template>
  <section class="wof-table-section">
    <puik-table
      :headers="headers"
      :search-bar="true"
      :items="paginatedItems"
      :sticky-last-col="stickyLastCol"
      :full-width="fullWidth"
      :search-from-server="true"
      :sort-from-server="true"
      @search-submit="handleSearchSubmit"
      @sort-column="handleSort"
    >
      <template #item-rank="{ item }">
        <div
          :class="[
            'wof-top-section__rank',
            { 'wof-top-section__rank--first': item.rank === 1 },
            { 'wof-top-section__rank--second': item.rank === 2 },
            { 'wof-top-section__rank--third': item.rank === 3 },
          ]"
        >
          <span class="puik-body-default-bold">{{ item.rank }}</span>
        </div>
      </template>

      <template #item-name="{ item }">
        <!-- Contributor display -->
        <div
          v-if="isContributor(item)"
          class="wof-contributors__login__container"
        >
          <puik-avatar
            size="large"
            type="photo"
            :src="item.avatar_url"
          />
          <div class="wof-top-contributors__name">
            <span class="puik-body-default">{{ item.name || item.login }}</span>
            <span
              v-if="item.name"
              class="puik-body-small-bold"
            >({{ item.login }})</span>
            <puik-tag
              v-if="item.company"
              :content="item.company"
              variant="blue"
            />
          </div>
        </div>

        <!-- Company display -->
        <div
          v-else-if="isCompany(item)"
          class="wof-contributors__login__container"
        >
          <puik-avatar
            v-if="item.avatar_url"
            size="large"
            type="photo"
            :src="item.avatar_url"
          />
          <puik-avatar
            v-else
            size="large"
            :first-name="item.name || item.login"
            :single-initial="false"
          />
          <div class="wof-top-contributors__name">
            <span
              v-if="item.login"
              class="puik-body-default"
            >
              {{ item.login }}
            </span>
            <span
              v-else-if="item.name"
              class="puik-body-default"
            >
              {{ item.name }}
            </span>
          </div>
        </div>

        <!-- Ranking display -->
        <div
          v-else-if="isRanking(item)"
          class="wof-contributors__login__container"
        >
          <puik-avatar
            size="large"
            type="photo"
            :src="item.avatar_url"
          />
          <div class="wof-top-contributors__name">
            <span class="puik-body-default">{{ item.name || item.login }}</span>
            <span
              v-if="item.name"
              class="puik-body-small-bold"
            >({{ item.login }})</span>
          </div>
        </div>
      </template>

      <template #item-count="{ item }">
        <span
          v-if="isRanking(item)"
          class="puik-body-default-bold"
        >{{ item.count }}</span>
      </template>

      <template #item-actions="{ item }">
        <!-- Contributor actions: button that emits event -->
        <puik-button
          v-if="type === 'contributor'"
          variant="text"
          force-legacy-text-variant
          right-icon="visibility"
          aria-label="view profile"
          @click="handleActionClick(item)"
        />

        <!-- Company / ranking actions: link to GitHub -->
        <a
          v-else-if="type === 'company' || type === 'ranking'"
          :href="item.html_url"
          target="_blank"
          aria-label="view profile"
          rel="noopener noreferrer"
        >
          <puik-button
            variant="text"
            force-legacy-text-variant
            right-icon="visibility"
            aria-label="view profile icon"
          />
        </a>
      </template>
    </puik-table>

    <div
      v-if="itemsRef.length === 0"
      class="wof-no-results"
    >
      No results found with your search.
    </div>

    <puik-pagination
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :variant="paginationVariant"
      :total-item="itemsRef.length"
      class="wof-table-pagination"
    />
  </section>
</template>

<style scoped>
.wof-table-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wof-table-pagination {
  align-self: center;
}

.wof-no-results {
  padding: 1rem;
  font-size: 1rem;
  text-align: center;
  color: var(--color-primary);
  background-color: var(--color-blue-50);
  border: 1px solid var(--color-blue);
}

.wof-contributors__login__container {
  display: flex;
  align-items: center;
  gap: 2rem;
  min-height: 66px;
}
</style>
