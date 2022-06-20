<template>
  <svg
    class="icon icon-link"
    fill="#000000"
    :height="height"
    :viewBox="viewBox"
    :width="width"
    transform="rotate(-45)"
  >
    <path transform="rotate(-45 12 12)" d="M0 0h24v24H0z" fill="none"></path>
    <path
      transform="rotate(-45 12 12)"
      d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
    ></path>
  </svg>
</template>

<script>
  export default {
    props: {
      height: {
        type: String,
        default: '24'
      },
      width: {
        type: String,
        default: '24'
      },
      viewBox: {
        type: String,
        default: '0 0 24 24'
      }
    }
  }
</script>
