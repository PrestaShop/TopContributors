<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  avatarUrl: string
  title: string
  subtitle?: string
  tags?: string[]
  infos?: { icon: string, label: string, value: string, href?: string }[]
  sections: { id: string, label: string }[]
}>()

const activeId = ref('')
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return
  observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
    if (visible[0]) activeId.value = visible[0].target.id
  }, { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.5, 1] })

  document.querySelectorAll<HTMLElement>('[data-detail-section]').forEach(el => observer!.observe(el))
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <aside class="wof-detail-sidebar">
    <img
      :src="avatarUrl"
      alt=""
      class="wof-detail-sidebar__avatar"
    >
    <h1 class="wof-detail-sidebar__title puik-h3">
      {{ title }}
    </h1>
    <p
      v-if="subtitle"
      class="wof-detail-sidebar__subtitle"
    >
      {{ subtitle }}
    </p>
    <div
      v-if="tags?.length"
      class="wof-detail-sidebar__tags"
    >
      <puik-tag
        v-for="t in tags"
        :key="t"
        :content="t"
        variant="blue"
      />
    </div>
    <div
      v-for="info in infos"
      :key="info.label"
      class="wof-detail-sidebar__info"
    >
      <puik-icon
        :icon="info.icon"
        :fill="0"
      />
      <div>
        <span class="wof-detail-sidebar__info-label puik-body-default">{{ info.label }}</span>
        <a
          v-if="info.href"
          :href="info.href"
          target="_blank"
          class="wof-detail-sidebar__info-value"
        >{{ info.value }}</a>
        <span
          v-else
          class="wof-detail-sidebar__info-value"
        >{{ info.value }}</span>
      </div>
    </div>
    <hr>
    <nav
      class="wof-detail-sidebar__jumpnav"
      aria-label="Sections"
    >
      <a
        v-for="s in sections"
        :key="s.id"
        :href="`#${s.id}`"
        :aria-current="activeId === s.id ? 'location' : undefined"
        class="wof-detail-sidebar__jumpnav-link"
      >{{ s.label }}</a>
    </nav>
  </aside>
</template>

<style scoped>
.wof-detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.75rem;
}
.wof-detail-sidebar__avatar {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  align-self: center;
  object-fit: cover;
}
.wof-detail-sidebar__title {
  text-align: center;
  margin: 0;
}
.wof-detail-sidebar__subtitle {
  text-align: center;
  color: #5e5e5e;
  margin: 0;
}
.wof-detail-sidebar__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
}
.wof-detail-sidebar__info {
  display: flex;
  gap: 0.5rem;
  align-items: start;
}
.wof-detail-sidebar__info-label {
  display: block;
  font-weight: 600;
  line-height: 1;
}
.wof-detail-sidebar__info-value {
  display: block;
  color: #5e5e5e;
  overflow-wrap: anywhere;
}
.wof-detail-sidebar__jumpnav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.wof-detail-sidebar__jumpnav-link {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-decoration: none;
  color: inherit;
}
.wof-detail-sidebar__jumpnav-link[aria-current='location'] {
  background: #ececf5;
  font-weight: 600;
}
</style>
