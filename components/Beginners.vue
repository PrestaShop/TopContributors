<template>
  <div class="contributors-section">
    <div class="col-12">
      <h2 class="text-center">Beginners</h2>
      <div class="text-center date">
        (1 to 5 contrib.)
      </div>
    </div>

    <ul id="newbie-contributors-list" class="col-md-12">
      <avatar-item
        v-for="contributor in contributors"
        :key="contributor.login"
        :contributor="contributor"
        category="rank-beginners"
      ></avatar-item>
    </ul>
  </div>
</template>

<script>
  import AvatarItem from './ui/AvatarItem.vue'

  export default {
    name: 'Beginners',
    components: {
      'avatar-item': AvatarItem
    },
    props: {
      contributors: {
        type: Array,
        default: () => []
      }
    }
  }
</script>
