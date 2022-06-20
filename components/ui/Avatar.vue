<template>
  <div
    :id="contributor.login"
    class="col-2 contributor simple-contributor"
    @click="showSelectedContributor"
  >
    <div class="avatar">
      <img :src="contributor.avatar_url" loading="lazy" />
    </div>
    <div class="details">
      <div class="fixed-height">
        <div class="name">{{ contributorName }}</div>
        <div class="username">
          <a
            :href="contributorGitHubLink"
            :title="contributor.login"
            target="_blank"
          >
            <github-icon height="12" width="12" view-box="0 0 16 16" />
          </a>
          <div v-if="contributorBlogLink" class="links">
            |
            <a :href="contributorBlogLink" target="_blank">
              <link-icon height="12" width="12" view-box="0 0 24 24" />
            </a>
          </div>
          <div v-if="organizationMembersDatas[contributor.login]" class="links">
            |
            <a
              href="https://www.prestashop-project.org/maintainers-guide/project-organization/"
            >
              <megaphone-icon height="12" width="12" view-box="0 0 16 16" />
            </a>
          </div>
        </div>
      </div>
      <div class="info">{{ contributor.contributions }} contrib.</div>
      <div :class="renderClasses">#{{ contributor.rank }}</div>
    </div>
  </div>
</template>

<script>
  import EventBus from '../utils/EventBus'
  import TopAvatar from './TopAvatar.vue'

  export default {
    name: 'Avatar',
    extends: TopAvatar,
    props: {
      contributor: {
        type: Object,
        default: () => {}
      },
      category: {
        type: String,
        default: ''
      }
    },
    computed: {
      renderClasses() {
        return `position ${this.category}`
      }
    },
    methods: {
      showSelectedContributor(event) {
        if (event.target.tagName !== 'A') {
          EventBus.$emit('showSelectedContributor', {
            selectedContributor: this.contributor
          })
        }
      }
    }
  }
</script>
