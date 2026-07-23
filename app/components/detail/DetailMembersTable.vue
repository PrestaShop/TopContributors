<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Contributor, Employee } from '@/types'

const props = defineProps<{
  employees: Employee[]
  contributorsData: Record<string, Contributor>
}>()

interface Row {
  login: string
  name: string
  avatarUrl: string
  hasContributorData: boolean
  periods: { start: string, end: string | null }[]
  firstStart: string
  lastEnd: string | null
  isActive: boolean
  tenureMonths: number
  mergedPRs: number
  firstYear: number | null
  lastYear: number | null
}

// The "still active" flag treats missing endDate OR an endDate in the future as
// currently employed. Traces stores end dates for departed employees; ongoing
// tenures use either null or a far-future date depending on how the entry was
// curated.
const TODAY = new Date().toISOString().slice(0, 10)

function monthsBetween(start: string, end: string): number {
  const [ys, ms] = start.split('-').map(Number)
  const [ye, me] = end.split('-').map(Number)
  return Math.max(0, (ye - ys) * 12 + (me - ms))
}

const rows = computed<Row[]>(() => {
  return props.employees.map((e) => {
    const contributor = props.contributorsData[e.login]
    const sortedFrames = [...e.time_frames].sort((a, b) =>
      a.start_date.localeCompare(b.start_date),
    )
    const periods = sortedFrames.map(f => ({ start: f.start_date, end: f.end_date }))
    const firstStart = sortedFrames[0]?.start_date ?? ''
    const lastFrame = sortedFrames[sortedFrames.length - 1]
    const lastEnd = lastFrame?.end_date ?? null
    const isActive = !lastEnd || lastEnd >= TODAY
    const tenureMonths = sortedFrames.reduce(
      (sum, f) => sum + monthsBetween(f.start_date, f.end_date ?? TODAY),
      0,
    )
    const byYear = contributor?.mergedPullRequestsByYear ?? {}
    const years = Object.keys(byYear)
      .map(Number)
      .filter(y => Number.isFinite(y) && (byYear[String(y)] ?? 0) > 0)
      .sort((a, b) => a - b)
    return {
      login: e.login,
      name: contributor?.name || e.login,
      avatarUrl: contributor?.avatar_url ?? '',
      hasContributorData: contributor != null,
      periods,
      firstStart,
      lastEnd,
      isActive,
      tenureMonths,
      mergedPRs: contributor?.mergedPullRequests ?? 0,
      firstYear: years[0] ?? null,
      lastYear: years[years.length - 1] ?? null,
    }
  })
})

type SortKey = 'name' | 'firstStart' | 'lastEnd' | 'tenure' | 'mergedPRs' | 'lastYear'
const sortKey = ref<SortKey>('firstStart')
const sortDir = ref<'asc' | 'desc'>('asc')

function toggleSort(k: SortKey) {
  if (sortKey.value === k) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  }
  else {
    sortKey.value = k
    sortDir.value = k === 'name' || k === 'firstStart' ? 'asc' : 'desc'
  }
}

const hasStubs = computed(() => rows.value.some(r => !r.hasContributorData))

const sortedRows = computed<Row[]>(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1
  const rs = [...rows.value]
  rs.sort((a, b) => {
    switch (sortKey.value) {
      case 'name':
        return dir * a.name.localeCompare(b.name)
      case 'firstStart':
        return dir * a.firstStart.localeCompare(b.firstStart)
      case 'lastEnd':
        return dir * ((a.lastEnd ?? '9999-99-99').localeCompare(b.lastEnd ?? '9999-99-99'))
      case 'tenure':
        return dir * (a.tenureMonths - b.tenureMonths)
      case 'mergedPRs':
        return dir * (a.mergedPRs - b.mergedPRs)
      case 'lastYear':
        return dir * ((a.lastYear ?? 0) - (b.lastYear ?? 0))
    }
  })
  return rs
})

function ariaSort(k: SortKey): 'ascending' | 'descending' | 'none' {
  if (sortKey.value !== k) return 'none'
  return sortDir.value === 'asc' ? 'ascending' : 'descending'
}

function formatDate(iso: string): string {
  // "2019-06-26" → "Jun 2019" — day rarely matters at a company-tenure scale.
  const [y, m] = iso.split('-').map(Number)
  const month = new Date(Date.UTC(y, (m ?? 1) - 1, 1)).toLocaleString('en-US', {
    month: 'short', timeZone: 'UTC',
  })
  return `${month} ${y}`
}

function formatTenure(months: number): string {
  if (months < 1) return '<1 mo'
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} mo`
  if (m === 0) return `${y} yr`
  return `${y}y ${m}m`
}
</script>

<template>
  <div
    id="section-members"
    class="wof-members-table"
    data-detail-section
  >
    <h3 class="puik-h3">
      Contributors ({{ rows.length }})
    </h3>
    <p class="wof-members-table__caption">
      Sourced from the
      <a
        href="https://github.com/PrestaShop/traces/blob/master/var/data/companies.json"
        target="_blank"
        rel="noopener noreferrer"
      >companies file</a>
      (declared employees).<template v-if="hasStubs">
        Rows without matching OSS activity are dimmed.
      </template>
    </p>

    <div class="wof-members-table__scroll">
      <table class="wof-members-table__table">
        <thead>
          <tr>
            <th
              scope="col"
              :aria-sort="ariaSort('name')"
            >
              <button
                type="button"
                class="wof-members-table__sort"
                @click="toggleSort('name')"
              >
                Contributor
              </button>
            </th>
            <th scope="col">
              Periods
            </th>
            <th
              scope="col"
              :aria-sort="ariaSort('firstStart')"
            >
              <button
                type="button"
                class="wof-members-table__sort"
                @click="toggleSort('firstStart')"
              >
                Joined
              </button>
            </th>
            <th
              scope="col"
              :aria-sort="ariaSort('lastEnd')"
            >
              <button
                type="button"
                class="wof-members-table__sort"
                @click="toggleSort('lastEnd')"
              >
                Status
              </button>
            </th>
            <th
              scope="col"
              :aria-sort="ariaSort('tenure')"
              class="wof-members-table__num"
            >
              <button
                type="button"
                class="wof-members-table__sort"
                @click="toggleSort('tenure')"
              >
                Tenure
              </button>
            </th>
            <th
              scope="col"
              :aria-sort="ariaSort('mergedPRs')"
              class="wof-members-table__num"
            >
              <button
                type="button"
                class="wof-members-table__sort"
                @click="toggleSort('mergedPRs')"
              >
                Merged PRs
              </button>
            </th>
            <th
              scope="col"
              :aria-sort="ariaSort('lastYear')"
              class="wof-members-table__num"
            >
              <button
                type="button"
                class="wof-members-table__sort"
                @click="toggleSort('lastYear')"
              >
                OSS years
              </button>
            </th>
            <th
              scope="col"
              class="wof-members-table__actions-col"
            >
              <span class="wof-members-table__sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in sortedRows"
            :key="row.login"
            :class="{ 'wof-members-table__row--stub': !row.hasContributorData }"
          >
            <td>
              <div class="wof-members-table__who">
                <img
                  v-if="row.avatarUrl"
                  :src="row.avatarUrl"
                  alt=""
                  class="wof-members-table__avatar"
                >
                <span
                  v-else
                  class="wof-members-table__avatar wof-members-table__avatar--placeholder"
                  aria-hidden="true"
                />
                <span class="wof-members-table__who-label">
                  <span class="wof-members-table__name">{{ row.name }}</span>
                  <span class="wof-members-table__handle">@{{ row.login }}</span>
                </span>
              </div>
            </td>
            <td>
              <ul class="wof-members-table__periods">
                <li
                  v-for="(p, idx) in row.periods"
                  :key="idx"
                >
                  {{ formatDate(p.start) }} → {{ p.end ? formatDate(p.end) : 'present' }}
                </li>
              </ul>
            </td>
            <td>{{ formatDate(row.firstStart) }}</td>
            <td>
              <span
                v-if="row.isActive"
                class="wof-members-table__tag wof-members-table__tag--active"
              >Active</span>
              <span
                v-else
                class="wof-members-table__tag wof-members-table__tag--left"
              >Left {{ row.lastEnd ? formatDate(row.lastEnd) : '' }}</span>
            </td>
            <td class="wof-members-table__num">
              {{ formatTenure(row.tenureMonths) }}
            </td>
            <td class="wof-members-table__num">
              {{ row.hasContributorData ? row.mergedPRs.toLocaleString() : '—' }}
            </td>
            <td class="wof-members-table__num">
              <template v-if="row.firstYear && row.lastYear">
                {{ row.firstYear === row.lastYear ? row.firstYear : `${row.firstYear}–${row.lastYear}` }}
              </template>
              <template v-else>
                —
              </template>
            </td>
            <td class="wof-members-table__actions-cell">
              <NuxtLink
                v-if="row.hasContributorData"
                :to="`/contributor/${row.login.toLowerCase()}`"
                :aria-label="`View ${row.name}'s contributor detail`"
              >
                <puik-button
                  variant="text"
                  force-legacy-text-variant
                  right-icon="insights"
                  :aria-label="`View ${row.name}'s contributor detail`"
                />
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.wof-members-table {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
}
.wof-members-table__caption {
  color: #5e5e5e;
  font-size: 0.85rem;
  margin: 0.25rem 0 0.75rem;
}
.wof-members-table__caption a {
  color: inherit;
  text-decoration: underline;
}
.wof-members-table__caption a:hover {
  color: #1d1d1b;
}
.wof-members-table__scroll {
  overflow-x: auto;
}
.wof-members-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.wof-members-table__table th,
.wof-members-table__table td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid #ececf5;
}
.wof-members-table__table th {
  font-weight: 600;
  background: #f7f7fa;
  position: sticky;
  top: 0;
  z-index: 1;
}
.wof-members-table__num {
  text-align: right;
  white-space: nowrap;
}
.wof-members-table__sort {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  color: inherit;
}
.wof-members-table__sort:hover {
  text-decoration: underline;
}
.wof-members-table__table th[aria-sort='ascending'] .wof-members-table__sort::after {
  content: ' ▲';
  font-size: 0.7em;
}
.wof-members-table__table th[aria-sort='descending'] .wof-members-table__sort::after {
  content: ' ▼';
  font-size: 0.7em;
}
.wof-members-table__who {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 180px;
}
.wof-members-table__actions-col {
  width: 1%;
}
.wof-members-table__actions-cell {
  text-align: right;
  white-space: nowrap;
}
.wof-members-table__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.wof-members-table__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.wof-members-table__avatar--placeholder {
  background: #ececf5;
}
.wof-members-table__who-label {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.wof-members-table__name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wof-members-table__handle {
  font-size: 0.8rem;
  color: #5e5e5e;
}
.wof-members-table__periods {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.wof-members-table__tag {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}
.wof-members-table__tag--active {
  background: #d4f5d4;
  color: #1e5c1e;
}
.wof-members-table__tag--left {
  background: #ececf5;
  color: #5e5e5e;
}
.wof-members-table__row--stub {
  color: #9a9a9a;
}
.wof-members-table__row--stub .wof-members-table__name {
  color: #7a7a7a;
}
</style>
