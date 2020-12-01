<template>
  <div class="contributor-links">
    <a
      class="contributor-links-github"
      v-if="contributor.html_url"
      :href="contributor.html_url"
      target="_blank"
    >
      Github
    </a>

    <a
      class="contributor-links-github"
      v-if="contributor.blog !== ''"
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
