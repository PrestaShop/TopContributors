<template>
  <div
    :id="contributor.login"
    class="contributor top-contributor"
    @click="showSelectedContributor"
  >
    <div class="top-contributor-content">
      <div class="avatar">
        <img :src="contributor.avatar_url" loading="lazy" />
      </div>
      <div class="details">
        <div class="position">#{{ contributor.rank }}</div>
        <div class="name">{{ contributorName }}</div>
        <div class="info">
          <a :href="contributorGitHubLink" target="_blank">
            ({{ contributor.login }})
          </a>
        </div>
        <div class="links">
          <a
            v-if="contributorBlogLink"
            :href="contributorBlogLink"
            target="_blank"
          >
            <link-icon />
          </a>
          <a v-if="contributorGitHubLink" :href="contributorGitHubLink">
            <github-icon />
          </a>
          <a
            v-if="organizationMembersDatas[contributor.login]"
            href="https://www.prestashop-project.org/maintainers-guide/project-organization/"
            target="_blank"
          >
            <megaphone-icon />
          </a>
        </div>
      </div>
      <div class="dots">
        <div class="dot" />
        <div class="dot" />
        <div class="dot" />
      </div>
    </div>
  </div>
</template>

<script>
  import EventBus from '../utils/EventBus'
  import GithubIcon from './GithubIcon'
  import LinkIcon from './LinkIcon'
  import MegaphoneIcon from './MegaphoneIcon'
  import organizationMembersDatas from '~/constants/organizationMembers'

  export default {
    name: 'TopAvatar',
    components: {
      LinkIcon,
      GithubIcon,
      MegaphoneIcon
    },
    props: {
      contributor: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        organizationMembersDatas
      }
    },
    computed: {
      contributorName() {
        const name = this.contributor.name
          ? this.contributor.name
          : this.contributor.login
        if (name.length >= 21) {
          return name.substr(0, 21) + ' (..)'
        }
        return name
      },
      contributorBlogLink() {
        return this.contributor.blog !== '' ? this.contributor.blog : false
      },
      contributorGitHubLink() {
        return this.contributor.html_url !== ''
          ? this.contributor.html_url
          : false
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
