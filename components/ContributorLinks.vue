<template>
  <div class="contributor-links">
    <a
      v-if="contributor.html_url"
      class="contributor-links-github"
      :href="contributor.html_url"
      target="_blank"
    >
      Github
    </a>

    <a
      v-if="contributor.blog !== ''"
      class="contributor-links-github"
      :href="contributor.blog"
      target="_blank"
    >
      {{ contributor.blog }}
    </a>
  </div>
</template>

<script lang="typescript">
  export default {
    name: 'ContributorRoles',
    props: {
      contributor: {
        type: Object,
        required: true,
      }
    },
  }
</script>

<style lang="scss">
  .contributor-links {
    a {
      color: #25b9d7;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 19px;
      font-weight: 600;
    }
  }
</style>
