<template>
  <header>
    <div class="gradient">
      <top-bar />

      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col col-md-8 text-md-center">
            <h1>Top contribution achievements</h1>
            <p class="white-text">
              Welcome!
              <br />
              <br />
              This page is dedicated to the code contributors building
              PrestaShop every day. Check below to see how much you helped the
              community, thanks to your involvement in open source.
            </p>
            <div>
              <a
                href="https://github.com/PrestaShop/PrestaShop"
                class="btn btn-primary"
              >
                Contribute now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="typescript">
  import TopBar from './TopBar.vue'

  export default {
    name: 'Header',
    components: {
      TopBar
    },
  }
</script>
