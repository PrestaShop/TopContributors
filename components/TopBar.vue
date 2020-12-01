<template>
  <div class="top-bar">
    <prestashop-logo />
  </div>
</template>

<script lang="typescript">
  import PrestashopLogo from './PrestashopLogo.vue'

  export default {
    name: 'TopBar',
    components: {
      PrestashopLogo
    },
  }
</script>

<style lang="scss">
  .top-bar {
    padding: 30px 40px;
  }
</style>
