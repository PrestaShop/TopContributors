<template>
  <div id="top-contributors" class="main-content">
    <div class="row contributors-container" v-if="!loading">
      <div class="col-12">
        <h2 class="text-center">Top contributors:</h2>
        <div class="text-center date">
          Last update:
          <strong>{{ today }}</strong>
        </div>
      </div>
      <div class="col-5 left-column">
        <top-avatar
          v-for="contributor in leftContributors"
          :contributor="contributor"
          :key="contributor.login"
        ></top-avatar>
      </div>
      <div class="contributors-center">
        <arrow :counts="counts"></arrow>
      </div>
      <div class="col-md-5 right-column">
        <top-avatar
          v-for="contributor in rightContributors"
          :contributor="contributor"
          :key="contributor.login"
        ></top-avatar>
      </div>
    </div>
    <all-contributors
      :contributors="contributors"
      v-if="!loading"
    ></all-contributors>
    <div class="loader d-flex justify-content-center mb-3" v-if="loading">
      <b-spinner label="Loading..."></b-spinner>
    </div>

    <b-modal
      id="selectedContributorModal"
      ref="selected-contributor-modal"
      hide-footer
      hide-header
    >
      <contributor-modal
        :contributor="selectedContributor"
        @close-modal="closeModal"
      />
    </b-modal>
  </div>
</template>

<script>
  import { BSpinner, BModal } from 'bootstrap-vue'
  import ArrowComponent from './ui/Arrow.vue'
  import TopAvatarComponent from './ui/TopAvatar.vue'
  import AllContributors from './AllContributors.vue'
  import ContributorModal from './ContributorModal.vue'
  import EventBus from './utils/EventBus'

  export default {
    name: 'topContributors',
    data() {
      return {
        contributors: [],
        loading: true,
        selectedContributor: {}
      }
    },
    created: function () {
      this.fetchData()
    },
    computed: {
      counts: function () {
        let counts = []
        this.topContributors.map((contributor) => {
          counts.push(contributor.contributions)
        })

        return counts
      },
      topContributors: function () {
        return this.contributors.slice(0, 10)
      },
      leftContributors: function () {
        let leftContributors = []
        this.topContributors.map((contributor, index) => {
          if (index % 2) {
            return
          }
          leftContributors.push(contributor)
        })

        return leftContributors
      },
      rightContributors: function () {
        let rightContributors = []
        this.topContributors.map((contributor, index) => {
          if (index % 2) {
            rightContributors.push(contributor)
          }
        })

        return rightContributors
      },
      today: function () {
        let date = new Date()
        let options = { year: 'numeric', month: 'long', day: 'numeric' }

        return date.toLocaleDateString('en-US', options)
      }
    },
    components: {
      arrow: ArrowComponent,
      'top-avatar': TopAvatarComponent,
      'all-contributors': AllContributors,
      BModal,
      ContributorModal
    },
    methods: {
      fetchData: function () {
        let self = this
        let req = new XMLHttpRequest()
        req.open('GET', './contributors.js', true)

        req.onreadystatechange = function () {
          if (req.status >= 200 && req.status < 400 && req.readyState === 4) {
            let contributors = JSON.parse(req.responseText)
            delete contributors.updatedAt

            Object.values(contributors).map((contributor, index) => {
              contributor.rank = ++index
              self.contributors.push(contributor)
            })

            self.loading = false
          }
        }

        req.send()
      },
      closeModal() {
        this.$refs['selected-contributor-modal'].hide()
      }
    },
    mounted() {
      EventBus.$on('showSelectedContributor', ({ selectedContributor }) => {
        this.selectedContributor = selectedContributor
        this.$refs['selected-contributor-modal'].show()
      })
    }
  }
</script>

<style lang="scss">
  .contributors {
    &-container {
      justify-content: space-around;
    }

    &-center {
      width: 100%;
      max-width: 126px;
    }
  }

  .modal-header {
    height: auto;
  }
</style>
