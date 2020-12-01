<template>
  <div>
    <section-header
      category="beginners"
      title="Beginners (1 to 5 contrib.)"
      :stars="1"
    ></section-header>
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
  import TitleOfSection from './ui/TitleOfSection.vue'
  import AvatarItem from './ui/AvatarItem.vue'

  export default {
    name: 'Beginners',
    components: {
      'section-header': TitleOfSection,
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
