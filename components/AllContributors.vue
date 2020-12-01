<template>
  <div>
    <div id="all-contributors" class="col-md-12">
      <Experts :contributors="experts"></Experts>
      <Enthusiasts :contributors="enthusiasts"></Enthusiasts>
      <Beginners :contributors="beginners"></Beginners>
    </div>
  </div>
</template>

<script>
  import Experts from './Experts.vue'
  import Enthusiasts from './Enthusiasts.vue'
  import Beginners from './Beginners.vue'

  export default {
    name: 'AllContributors',
    components: {
      Experts,
      Enthusiasts,
      Beginners
    },
    props: {
      contributors: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      experts() {
        return this.contributors.filter((contributor) => {
          return contributor.rank > 10 && contributor.contributions > 25
        })
      },
      enthusiasts() {
        return this.contributors.filter((contributor) => {
          return (
            contributor.rank > 10 &&
            contributor.contributions <= 25 &&
            contributor.contributions > 5
          )
        })
      },
      beginners() {
        return this.contributors.filter((contributor) => {
          return contributor.rank > 10 && contributor.contributions <= 5
        })
      }
    }
  }
</script>
