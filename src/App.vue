<template>
  <div id="root">
    <topContributors></topContributors>
  </div>
</template>

<script>
import TopContributors from './components/TopContributors'

export default {
  name: 'app',
  components: {
    TopContributors
  }
}
</script>

<style lang="scss" src="./assets/style/theme.scss"></style>
