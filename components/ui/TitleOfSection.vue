<template>
  <div :class="renderClasses">
    <img v-for="i in stars" :key="i.title" src="../../static/img/star.png" />
    {{ title }}
    <img v-for="i in stars" :key="i.title" src="../../static/img/star.png" />
  </div>
</template>

<script>
  export default {
    name: 'SectionHeader',
    props: {
      title: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      stars: {
        type: Number,
        required: true
      }
    },
    computed: {
      renderClasses() {
        return 'col-md-12 title ' + this.category
      }
    }
  }
</script>
