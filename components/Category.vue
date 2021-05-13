<template>
  <div class="category">
    <a
      v-if="type === 'category'"
      class="contributions-item repository"
      @click="$emit('select', category)"
    >
      <p class="contribution-number">{{ category.total }}</p>

      <p class="contribution-name" v-html="text"></p>
    </a>
    <a
      v-if="type === 'repository'"
      :href="`https://github.com/${text}/commits?author=${contributor.login}`"
      target="_blank"
      class="contributions-item repository"
    >
      <p class="contribution-number">{{ number }}</p>

      <p class="contribution-name">
        {{ text.replace('PrestaShop/', '') }}
      </p>
    </a>
  </div>
</template>

<script lang="typescript">
  export default {
    name: 'Category',
    props: {
      category: {
        type: Object,
        default: () => {}
      },
      number: {
        type: Number,
        default: 0
      },
      text: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      contributor: {
        type: Object,
        required: true
      }
    },
  }
</script>

<style lang="scss">
  .contributions-item {
    height: 121px;
    width: 231px;
    border-radius: 4px;
    box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.2);
    color: #fff;
    padding: 16px 30px;
    margin: 7.5px;
    transform: translateY(-20px);
    opacity: 0;
    transition: 0.25s ease-out;
    text-decoration: none;
    display: block;
    box-shadow: 0 0 0 0 rgba(#000, 0.4);
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 10px 1px rgba(#000, 0.6);
      transform: translateY(-20px);
      text-decoration: none;
      color: #fff;
    }

    @for $i from 1 through 30 {
      &:nth-child(#{$i}) {
        transition-delay: 0.05s * $i;
      }
    }

    @at-root .show & {
      opacity: 1;
      transform: translateY(0);
    }

    .contribution-name {
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 18px;
    }

    .contribution-number {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 33px;
    }

    &.repository {
      background-color: #011738;
    }
  }
</style>
