<script setup lang="ts">
import type { Contributor } from '@/types'

defineProps<{
  contributor: Contributor
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const selectedCategory = ref<string | null>(null)
const positionTab = ref(1)
const copyState = ref(false)

const copyContributorLink = async (contributor: Contributor) => {
  const url = new URL(window.location.href)
  url.searchParams.set('contributor', contributor.login)

  try {
    await navigator.clipboard.writeText(url.toString())
  }
  catch (e) {
    console.info('Clipboard API not supported, falling back to execCommand.', e)
    const el = document.createElement('textarea')
    el.value = url.toString()
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copyState.value = true
  setTimeout(() => {
    copyState.value = false
  }, 500)
}

const close = () => {
  emit('close')
  selectedCategory.value = null
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
}
</script>

<template>
  <puik-modal
    class="wof-top-modal"
    size="large"
    variant="feedback"
    :is-open="isOpen"
    @close="close"
  >
    <puik-button
      class="wof-top-modal__close-btn"
      variant="text"
      force-legacy-text-variant
      size="sm"
      @click="close"
    >
      <puik-icon
        icon="close"
        font-size="1.25rem"
      />
    </puik-button>
    <div class="wof-top-modal__container">
      <div class="wof-top-modal__side-content">
        <div class="wof-top-modal__avatar">
          <img
            :src="contributor.avatar_url"
            alt="contributor avatar"
          >
        </div>
        <div class="wof-top-modal__title">
          <div v-if="contributor.name">
            <h3 class="puik-h3">
              {{ contributor.name }}
            </h3>
            <span class="puik-body-default-bold">({{ contributor.login }})</span>
          </div>
          <h3
            v-else
            class="puik-h3"
          >
            {{ contributor.login }}
          </h3>
          <puik-tag
            v-if="contributor.company"
            :content="contributor.company"
            variant="blue"
          />
        </div>
        <div
          v-if="contributor.location"
          class="wof-top-modal__side-content__item"
        >
          <puik-icon
            icon="location_on"
            :fill="0"
          />
          <div class="wof-top-modal__side-content__item-infos">
            <span class="wof-top-modal__side-content__item-title puik-body-default">Location</span>
            <span class="wof-top-modal__side-content__item-value puik-body-default">
              {{ contributor.location }}
            </span>
          </div>
        </div>
        <div
          v-if="contributor.company"
          class="wof-top-modal__side-content__item"
        >
          <puik-icon
            icon="work"
            :fill="0"
          />
          <div class="wof-top-modal__side-content__item-infos">
            <span class="wof-top-modal__side-content__item-title puik-body-default">
              Current role(s)
            </span>
            <span class="wof-top-modal__side-content__item-value puik-body-default">
              {{ contributor.company }}
            </span>
          </div>
        </div>
        <div
          v-if="contributor.html_url"
          class="wof-top-modal__side-content__item"
        >
          <puik-icon
            icon="location_on"
            :fill="0"
          />
          <div class="wof-top-modal__side-content__item-infos">
            <span class="wof-top-modal__side-content__item-title puik-body-default">GitHub</span>
            <puik-link
              :href="contributor.html_url"
              target="_blank"
              aria-label="contributor github"
              class="wof-top-modal__side-content__item-value puik-body-default"
            >
              {{ contributor.html_url }}
            </puik-link>
          </div>
        </div>
        <div
          v-if="contributor.blog"
          class="wof-top-modal__side-content__item"
        >
          <puik-icon
            icon="desktop_mac"
            :fill="0"
          />
          <div class="wof-top-modal__side-content__item-infos">
            <span class="wof-top-modal__side-content__item-title puik-body-default">Website</span>
            <puik-link
              :href="contributor.blog"
              target="_blank"
              aria-label="contributor blog"
              class="wof-top-modal__side-content__item-value puik-body-default"
            >
              {{ contributor.blog }}
            </puik-link>
          </div>
        </div>
      </div>

      <div class="wof-top-modal__main-content">
        <NuxtLink
          :to="`/contributor/${contributor.login}`"
          class="puik-button puik-button--secondary wof-top-modal__see-full-page"
          @click="close"
        >
          View full page →
        </NuxtLink>
        <puik-button
          class="wof-top-modal__copy-link-button"
          variant="secondary"
          size="sm"
          left-icon="link"
          @click="copyContributorLink(contributor)"
        >
          <span v-if="copyState">Copied!</span>
          <span v-else>Copy link</span>
        </puik-button>
        <puik-tab-navigation
          :key="positionTab"
          name="contributor-modal-tab-nav"
          :default-position="positionTab"
        >
          <puik-tab-navigation-group-titles aria-label="contributor-modal-tab-nav-titles">
            <puik-tab-navigation-title :position="1">
              Contributions ({{ contributor.mergedPullRequests }})
            </puik-tab-navigation-title>
            <puik-tab-navigation-title
              v-if="contributor.bio && contributor.bio !== ''"
              :position="2"
            >
              About
            </puik-tab-navigation-title>
          </puik-tab-navigation-group-titles>
          <puik-tab-navigation-group-panels>
            <puik-tab-navigation-panel :position="1">
              <puik-button
                v-if="selectedCategory"
                class="wof-top-modal__back-button"
                size="sm"
                left-icon="arrow_back"
                @click="selectedCategory = null"
              >
                back
              </puik-button>
              <div
                v-if="!selectedCategory"
                class="wof-top-modal__categories"
              >
                <puik-card
                  v-for="(data, category) in contributor.categories"
                  :key="category"
                  class="wof-top-modal__category__card"
                  @click="selectCategory(category)"
                >
                  <p class="puik-h2">
                    {{ data.total }}
                  </p>
                  <p class="puik-body-default">
                    {{ category }}
                  </p>
                </puik-card>
              </div>
              <div
                v-if="
                  selectedCategory
                    && contributor.categories
                    && contributor.categories[selectedCategory]
                "
                class="wof-top-modal__categories"
              >
                <a
                  v-for="(data, repository) in contributor.categories[selectedCategory]
                    ?.repositories || {}"
                  :key="repository"
                  class="wof-top-modal__repository__link"
                  :href="`https://github.com/PrestaShop/${repository}/pulls?q=is%3Apr+is%3Amerged+author%3A${contributor.login}`"
                  target="_blank"
                >
                  <puik-card
                    :key="repository"
                    class="wof-top-modal__repository__card"
                  >
                    <p class="puik-h2">{{ data }}</p>
                    <p class="puik-body-default">{{ repository }}</p>
                  </puik-card>
                </a>
              </div>
            </puik-tab-navigation-panel>
            <puik-tab-navigation-panel
              v-if="contributor.bio && contributor.bio !== ''"
              :position="2"
            >
              <div class="puik-body-default p-4 bg-white">
                {{ contributor.bio }}
              </div>
            </puik-tab-navigation-panel>
          </puik-tab-navigation-group-panels>
        </puik-tab-navigation>
      </div>
    </div>
  </puik-modal>
</template>

<style>
:root {
  --wof-color-bg-modal: #ffffff;
  --wof-color-bg-modal-side-panel: #dddddd;
  --wof-color-side-panel-item-value: #5e5e5e;
  --wof-padding-top-modal: 8.5rem;
  --wof-padding-modal: 20px;
}

@media screen and (min-width: 768px) {
  :root {
    --wof-padding-modal: 40px;
  }
}

.wof-top-modal__close-btn {
  position: absolute;
  right: 1rem;
  top: 1rem;
}
.wof-top-modal .puik-modal__dialogPanelContainer__dialogPanel {
  background-color: var(--wof-color-bg-modal);
  padding: 0;
}

.wof-top-modal__container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: var(--wof-color-bg-modal-side-panel);
  overflow: auto;
  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
}
.wof-top-modal__title {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.wof-top-modal__title h3 {
  margin-bottom: 0;
}

.wof-top-modal__main-content .puik-tab-navigation__group-panels {
  padding: 1rem 0;
}
.wof-top-modal__side-content {
  padding: 20px;
  min-width: min-content;
  min-height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: self-start;
  gap: 1rem;
  background-color: var(--wof-color-bg-modal);
  overflow-y: auto;
  @media screen and (min-width: 768px) {
    padding: 40px;
  }
}
.wof-top-modal__avatar {
  border-radius: 50%;
  min-height: 128px;
  overflow: hidden;
}
.wof-top-modal__avatar img {
  width: 128px;
  height: 128px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}
.wof-top-modal__side-content__item {
  display: flex;
  align-items: start;
  gap: 0.5rem;
}
.wof-top-modal__side-content__item-infos {
  display: flex;
  flex-direction: column;
}
.wof-top-modal__side-content__item-title {
  line-height: 1;
}
.wof-top-modal__side-content__item-value {
  color: var(--wof-color-side-panel-item-value);
}
.wof-top-modal__main-content {
  padding: var(--wof-padding-modal);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: fit-content;
  gap: 1rem;
  overflow: auto;
}
.wof-top-modal__copy-link-button {
  position: absolute;
  right: var(--wof-padding-modal);
  transform: translateY(50%);
  z-index: 2;
  min-width: 92px;
}
.wof-top-modal__copy-link-button span {
  margin-right: auto;
}
.wof-top-modal__see-full-page {
  position: absolute;
  right: calc(var(--wof-padding-modal) + 92px + 0.5rem);
  transform: translateY(50%);
  z-index: 2;
  text-decoration: none;
}
.wof-top-modal__categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
.wof-top-modal__category__card,
.wof-top-modal__repository__card {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  cursor: pointer;
}
.wof-top-modal__category__card p,
.wof-top-modal__repository__card p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wof-top-modal__repository__link {
  display: flex;
}
.wof-top-modal__repository__card {
  flex-grow: 1;
  overflow-x: hidden;
}
.wof-top-modal__back-button {
  align-self: start;
  margin-bottom: 1rem;
}
</style>
