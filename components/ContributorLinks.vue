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
      class="contributor-links-blog"
      :href="contributor.blog"
      target="_blank"
    >
      {{ blogText }}
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
    computed: {
      blogText() {
        let url = this.contributor.blog.replace(/^https?:\/\//, '');

        if (url.length > 22) {
          url = `${url.substring(0, 22)}...`;
        }

        return url;
      }
    }
  }
</script>

<style lang="scss">
  .contributor-links {
    margin-top: 30px;

    a {
      color: #25b9d7;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 19px;
      font-weight: 600;
      display: block;
    }
  }
</style>
