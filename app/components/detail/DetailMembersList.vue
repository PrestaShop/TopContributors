<script setup lang="ts">
import type { Contributor } from '@/types'

defineProps<{
  members: (Pick<Contributor, 'login' | 'name' | 'avatar_url'>)[]
}>()
</script>

<template>
  <div
    id="section-members"
    class="wof-detail-members"
    data-detail-section
  >
    <h3 class="puik-h3">
      Contributors ({{ members.length }})
    </h3>
    <ul class="wof-detail-members__grid">
      <li
        v-for="m in members"
        :key="m.login"
        class="wof-detail-members__item"
      >
        <NuxtLink
          :to="`/contributor/${m.login.toLowerCase()}`"
          class="wof-detail-members__link"
          :aria-label="`View ${m.name || m.login}'s detail page`"
        >
          <img
            v-if="m.avatar_url"
            :src="m.avatar_url"
            alt=""
            class="wof-detail-members__avatar"
          >
          <div class="wof-detail-members__label">
            <span class="wof-detail-members__name">{{ m.name || m.login }}</span>
            <span
              v-if="m.name"
              class="wof-detail-members__handle"
            >@{{ m.login }}</span>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.wof-detail-members {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
}
.wof-detail-members__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem;
}
.wof-detail-members__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease;
}
.wof-detail-members__link:hover {
  background: #ececf5;
}
.wof-detail-members__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.wof-detail-members__label {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.wof-detail-members__name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wof-detail-members__handle {
  font-size: 0.85rem;
  color: #5e5e5e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
