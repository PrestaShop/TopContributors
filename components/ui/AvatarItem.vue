<template>
  <li class="newbie-contributor" @click="showSelectedContributor">
    <div class="avatar">
      <img :src="contributor.avatar_url" loading="lazy" />
    </div>
    <div :class="renderClasses">
      <b>#{{ contributor.rank }}</b>
    </div>
    <div class="name">({{ contributor.login }})</div>
    <div class="contributions">{{ contributor.contributions }} contrib.</div>
  </li>
</template>

<script>
  import Avatar from './Avatar.vue'

  export default {
    name: 'AvatarItem',
    extends: Avatar,
    props: {
      contributor: {
        type: Object,
        default: () => {}
      },
      category: {
        type: String,
        default: ''
      }
    }
  }
</script>
