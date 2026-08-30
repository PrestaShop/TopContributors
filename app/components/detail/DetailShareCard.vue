<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ login: string }>()

type RankingVariant = 'overall' | 'author' | 'reviewer' | 'qa' | 'issues'
const VARIANTS: { value: RankingVariant, label: string }[] = [
  { value: 'overall', label: 'Overall' },
  { value: 'author', label: 'Top author' },
  { value: 'reviewer', label: 'Top reviewer' },
  { value: 'qa', label: 'Top QA' },
  { value: 'issues', label: 'Top issues' },
]
const variant = ref<RankingVariant>('overall')

// Absolute URL so the snippet works when pasted anywhere. Falls back to the
// production origin during SSR (import.meta.client guard keeps window off the
// server path).
const origin = computed(() =>
  import.meta.client ? window.location.origin : 'https://contributors.prestashop-project.org',
)
// Omit the query param for the default variant so existing embeds stay bit-for-bit stable.
const rankingQuery = computed(() => (variant.value === 'overall' ? '' : `?ranking=${variant.value}`))
const cardUrl = computed(() => `${origin.value}/card/${props.login}.svg${rankingQuery.value}`)
const markdown = computed(() => `[![PrestaShop Top Contributor](${cardUrl.value})](${origin.value}/contributor/${props.login})`)

const copied = ref<'url' | 'md' | null>(null)
const copy = async (kind: 'url' | 'md', text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = kind
    setTimeout(() => {
      if (copied.value === kind) copied.value = null
    }, 1500)
  }
  catch { /* clipboard unavailable — user can still select the text */ }
}
</script>

<template>
  <section
    id="section-share"
    class="wof-detail-share"
    data-detail-section
  >
    <h2 class="wof-detail-share__title">
      Share your card
    </h2>
    <p class="wof-detail-share__lede">
      Embed this card in your GitHub profile README or anywhere else.
    </p>

    <div
      class="wof-detail-share__variants"
      role="tablist"
      aria-label="Ranking variant"
    >
      <button
        v-for="v in VARIANTS"
        :key="v.value"
        type="button"
        role="tab"
        :aria-selected="variant === v.value"
        :class="['wof-detail-share__variant', { 'is-active': variant === v.value }]"
        @click="variant = v.value"
      >
        {{ v.label }}
      </button>
    </div>

    <div class="wof-detail-share__preview">
      <img
        :src="cardUrl"
        :alt="`PrestaShop Top Contributor card for ${login}`"
        loading="lazy"
      >
    </div>

    <div class="wof-detail-share__field">
      <label>Markdown</label>
      <div class="wof-detail-share__row">
        <input
          :value="markdown"
          readonly
          @focus="($event.target as HTMLInputElement).select()"
        >
        <button
          type="button"
          @click="copy('md', markdown)"
        >
          {{ copied === 'md' ? 'Copied' : 'Copy' }}
        </button>
      </div>
    </div>

    <div class="wof-detail-share__field">
      <label>URL</label>
      <div class="wof-detail-share__row">
        <input
          :value="cardUrl"
          readonly
          @focus="($event.target as HTMLInputElement).select()"
        >
        <button
          type="button"
          @click="copy('url', cardUrl)"
        >
          {{ copied === 'url' ? 'Copied' : 'Copy' }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wof-detail-share {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.wof-detail-share__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1d1d1b;
}
.wof-detail-share__lede {
  margin: 0;
  color: #5e5e5e;
  font-size: 0.9rem;
}
.wof-detail-share__variants {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.wof-detail-share__variant {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.4rem 0.75rem;
  border: 1px solid #dddddd;
  border-radius: 999px;
  background: #f7f7f7;
  color: #1d1d1b;
  cursor: pointer;
}
.wof-detail-share__variant:hover {
  border-color: #7b4fac;
  color: #7b4fac;
}
.wof-detail-share__variant.is-active {
  background: #7b4fac;
  border-color: #7b4fac;
  color: #fff;
}
.wof-detail-share__preview {
  background: #f4f4f8;
  border-radius: 0.4rem;
  padding: 0.75rem;
  display: flex;
  justify-content: center;
}
.wof-detail-share__preview img {
  max-width: 100%;
  height: auto;
  display: block;
}
.wof-detail-share__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.wof-detail-share__field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #5e5e5e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.wof-detail-share__row {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}
.wof-detail-share__row input {
  flex: 1;
  min-width: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8rem;
  padding: 0.55rem 0.75rem;
  border: 1px solid #dddddd;
  border-radius: 0.35rem;
  background: #f7f7f7;
  color: #1d1d1b;
}
.wof-detail-share__row button {
  flex-shrink: 0;
  font-weight: 600;
  padding: 0.55rem 1rem;
  border: 0;
  border-radius: 0.35rem;
  background: #7b4fac;
  color: #fff;
  cursor: pointer;
}
.wof-detail-share__row button:hover {
  background: #6a4194;
}
</style>
