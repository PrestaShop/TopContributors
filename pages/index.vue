<template>
  <div>
    <custom-header />
    <div class="container">
      <top-contributors />
    </div>
    <custom-footer />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import TopContributors from '../components/TopContributors.vue'
  import CustomHeader from '../components/Header.vue'
  import CustomFooter from '../components/Footer.vue'

  export default Vue.extend({
    components: {
      TopContributors,
      CustomHeader,
      CustomFooter
    }
  })
</script>

<style lang="scss" src="../assets/style/theme.scss"></style>
