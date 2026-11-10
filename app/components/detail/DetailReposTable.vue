<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PuikTableHeader, searchOption, sortOption } from '@prestashopcorp/puik-components'

type RepoRow = { name: string, total: number, byYear: Record<string, number> }

const props = defineProps<{
  rows: RepoRow[]
  latestYears?: string[]
  // When set, each repository links to this author's merged PRs on GitHub.
  // Company pages leave it unset: no GitHub query matches company attribution.
  authorLogin?: string
}>()

const mergedPrsUrl = (repository: string, login: string) =>
  `https://github.com/PrestaShop/${repository}/pulls?q=is%3Apr+is%3Amerged+author%3A${encodeURIComponent(login)}`

const headers: PuikTableHeader[] = [
  {
    text: 'Repository',
    value: 'name',
    size: 'lg',
    align: 'left',
    searchable: true,
    sortable: true,
  },
  {
    text: 'Total',
    value: 'total',
    size: 'sm',
    align: 'right',
    sortable: true,
  },
]

const itemsRef = ref<RepoRow[]>([...props.rows])

watch(
  () => props.rows,
  (newVal) => {
    if (newVal) itemsRef.value = [...newVal]
  },
  { immediate: true },
)

const handleSearchSubmit = (payload: searchOption[]) => {
  let filtered = [...props.rows]

  payload.forEach(({ searchBy, inputText }) => {
    if (inputText) {
      const search = inputText.toLowerCase().trim().replace(/\s+/g, ' ')
      filtered = filtered.filter((item) => {
        const typedItem = item as unknown as Record<string, unknown>
        return String(typedItem[searchBy] ?? '').toLowerCase().includes(search)
      })
    }
  })

  itemsRef.value = payload.length ? filtered : [...props.rows]
}

const handleSort = (payload: sortOption) => {
  const { sortBy, sortOrder } = payload

  if (!sortBy) return

  itemsRef.value = [...itemsRef.value].sort((a, b) => {
    const typedA = a as unknown as Record<string, unknown>
    const typedB = b as unknown as Record<string, unknown>
    const valA = typedA[sortBy]
    const valB = typedB[sortBy]

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'ASC' ? valA - valB : valB - valA
    }
    return sortOrder === 'ASC'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA))
  })
}
</script>

<template>
  <div
    id="section-repos-table"
    class="wof-detail-repos-table"
    data-detail-section
  >
    <h3 class="puik-h3">
      All repositories
    </h3>
    <puik-table
      :headers="headers"
      :search-bar="true"
      :items="itemsRef"
      :full-width="true"
      :search-from-server="true"
      :sort-from-server="true"
      @search-submit="handleSearchSubmit"
      @sort-column="handleSort"
    >
      <template #item-name="{ item }">
        <a
          v-if="authorLogin"
          class="wof-detail-repos-table__link"
          :href="mergedPrsUrl(item.name, authorLogin)"
          target="_blank"
          rel="noopener"
        >{{ item.name }}</a>
        <span v-else>{{ item.name }}</span>
      </template>
      <template #item-total="{ item }">
        <span class="puik-body-default-bold">{{ item.total }}</span>
      </template>
    </puik-table>
  </div>
</template>

<style scoped>
.wof-detail-repos-table {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
}
.wof-detail-repos-table__link {
  color: #6366f1;
  text-decoration: none;
}
.wof-detail-repos-table__link:hover {
  text-decoration: underline;
}
</style>
