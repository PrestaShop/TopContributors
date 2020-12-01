<template>
  <div>
    <section-header
      category="experts"
      title="Experts (More than 25 contrib.)"
      :stars="3"
    ></section-header>
    <div class="row col-10 offset-1 pb-4">
      <avatar
        v-for="contributor in contributors"
        :key="contributor.login"
        :contributor="contributor"
        category="rank-experts"
      ></avatar>
    </div>
  </div>
</template>

<script>
  import TitleOfSection from './ui/TitleOfSection.vue'
  import Avatar from './ui/Avatar.vue'

  export default {
    name: 'Experts',
    components: {
      'section-header': TitleOfSection,
      avatar: Avatar
    },
    props: {
      contributors: {
        type: Array,
        default: () => []
      }
    }
  }
</script>
