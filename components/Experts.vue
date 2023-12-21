<template>
  <div class="contributors-section">
    <div class="col-12">
      <h2 class="text-center">Experts</h2>
      <div class="text-center date">(More than 25 contrib.)</div>
    </div>

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
  import Avatar from './ui/Avatar.vue'

  export default {
    name: 'Experts',
    components: {
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
