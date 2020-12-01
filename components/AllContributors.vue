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
    name: 'allContributors',
    components: {
      Experts: Experts,
      Enthusiasts: Enthusiasts,
      Beginners: Beginners
    },
    computed: {
      experts: function() {
        return this.contributors.filter(contributor => {
          return contributor.rank > 10 && contributor.contributions > 25
        })
      },
      enthusiasts: function() {
        return this.contributors.filter(contributor => {
          return (
            contributor.rank > 10 &&
            contributor.contributions <= 25 &&
            contributor.contributions > 5
          )
        })
      },
      beginners: function() {
        return this.contributors.filter(contributor => {
          return contributor.rank > 10 && contributor.contributions <= 5
        })
      }
    },
    props: {
      contributors: {
        type: Array,
        default: () => []
      }
    }
  }
</script>
