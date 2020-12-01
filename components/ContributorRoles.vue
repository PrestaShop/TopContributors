<template>
  <div class="contributor-roles">
    <p class="contributor-roles-title">Current role(s):</p>

    <p v-if="contributor.company" class="contributor-roles-company">
      {{ contributor.company }}
    </p>

    <!-- <p v-if="contributor.email_domain !== ''" class="contributor-roles-email">
      {{ contributor.email_domain }}
    </p> -->
  </div>
</template>

<script lang="typescript">
  export default {
    name: 'ContributorRoles',
    props: {
      contributor: {
        type: Object,
        required: true,
      }
    },
  }
</script>

<style lang="scss">
  .contributor-roles {
    &-title {
      color: #2e2e2e;
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 22px;
      margin-bottom: 8px !important;
    }

    &-company {
      color: #2e2e2e;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 19px;
      font-weight: 600;
    }

    &-email {
      color: #2e2e2e;
      font-size: 13px;
      letter-spacing: 0;
      line-height: 18px;
      font-weight: 600;
      margin-top: 25px !important;
    }

    p {
      margin: 0;
    }
  }
</style>
