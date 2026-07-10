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
let scrollHandler: (() => void) | null = null

// Canonical scroll-spy: the active section is the last one whose top edge
// has scrolled past a fixed offset from the top of the viewport (25%).
// Simpler and more reliable than IntersectionObserver ratio-based approaches,
// which favour tall sections that fill the viewport even after they scroll past.
onMounted(() => {
  if (typeof window === 'undefined') return

  const OFFSET_RATIO = 0.25

  const updateActive = () => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-detail-section]'))
    if (sections.length === 0) return
    const trigger = window.innerHeight * OFFSET_RATIO
    let active = sections[0].id
    let activeTop = -Infinity
    for (const s of sections) {
      const top = s.getBoundingClientRect().top
      if (top - trigger > 0) break
      // Only overwrite when this section is meaningfully BELOW the current active.
      // Prevents sibling sections in the same row (e.g. yearly chart + PR donut
      // in a two-column grid) from stealing focus from each other — they share
      // the same top, so we stick with the first one encountered in DOM order.
      if (top - activeTop > 20) {
        active = s.id
        activeTop = top
      }
    }
    activeId.value = active
  }

  scrollHandler = () => window.requestAnimationFrame(updateActive)
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('resize', scrollHandler, { passive: true })
  // Initial state after mount + a tick so sections have laid out.
  window.setTimeout(updateActive, 50)
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    window.removeEventListener('resize', scrollHandler)
  }
})
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
