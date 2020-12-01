<template>
  <div id="top-contributors" class="main-content">
    <div v-if="!loading" class="row contributors-container">
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
          :key="contributor.login"
          :contributor="contributor"
        ></top-avatar>
      </div>
      <div class="contributors-center">
        <arrow :counts="counts"></arrow>
      </div>
      <div class="col-md-5 right-column">
        <top-avatar
          v-for="contributor in rightContributors"
          :key="contributor.login"
          :contributor="contributor"
        ></top-avatar>
      </div>
    </div>
    <all-contributors
      v-if="!loading"
      :contributors="contributors"
    ></all-contributors>
    <div v-if="loading" class="loader d-flex justify-content-center mb-3">
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
    name: 'TopContributors',
    components: {
      arrow: ArrowComponent,
      'top-avatar': TopAvatarComponent,
      'all-contributors': AllContributors,
      BModal,
      BSpinner,
      ContributorModal
    },
    data() {
      return {
        contributors: [],
        loading: true,
        selectedContributor: {}
      }
    },
    computed: {
      counts() {
        const counts = []
        this.topContributors.map((contributor) => {
          counts.push(contributor.contributions)
        })

        return counts
      },
      topContributors() {
        return this.contributors.slice(0, 10)
      },
      leftContributors() {
        const leftContributors = []
        this.topContributors.map((contributor, index) => {
          if (index % 2) {
            return
          }
          leftContributors.push(contributor)
        })

        return leftContributors
      },
      rightContributors() {
        const rightContributors = []
        this.topContributors.map((contributor, index) => {
          if (index % 2) {
            rightContributors.push(contributor)
          }
        })

        return rightContributors
      },
      today() {
        const date = new Date()
        const options = { year: 'numeric', month: 'long', day: 'numeric' }

        return date.toLocaleDateString('en-US', options)
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {
      EventBus.$on('showSelectedContributor', ({ selectedContributor }) => {
        this.selectedContributor = selectedContributor
        this.$refs['selected-contributor-modal'].show()
      })
    },
    methods: {
      fetchData() {
        const self = this
        const req = new XMLHttpRequest()
        req.open('GET', './contributors.js', true)

        req.onreadystatechange = function () {
          if (req.status >= 200 && req.status < 400 && req.readyState === 4) {
            const contributors = JSON.parse(req.responseText)
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
