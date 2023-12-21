<template>
  <div id="top-contributors" class="main-content">
    <div v-if="!loading" class="row contributors-container">
      <div class="col-12">
        <h2 class="text-center">Top contributors:</h2>
        <div class="text-center date">Last update: {{ today }}</div>
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
      @hidden="resetUrl"
    >
      <contributor-popup
        :contributor="selectedContributor"
        @close-modal="closeModal"
      />
    </b-modal>
  </div>
</template>

<script>
  import { BSpinner, BModal } from 'bootstrap-vue'
  import ArrowComponent from './ui/Arrow'
  import TopAvatarComponent from './ui/TopAvatar'
  import AllContributors from './AllContributors'
  import ContributorPopup from './ContributorPopup'
  import EventBus from './utils/EventBus'

  export default {
    name: 'TopContributors',
    components: {
      arrow: ArrowComponent,
      'top-avatar': TopAvatarComponent,
      'all-contributors': AllContributors,
      BModal,
      BSpinner,
      ContributorPopup
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

        if (!this.selectedContributor.sortedRepositories) {
          let repositoriesArray = []
          const tempArray = Object.keys(this.selectedContributor.repositories)
          repositoriesArray = tempArray.map((e) => {
            repositoriesArray[e] = this.selectedContributor.repositories[e]

            return {
              number: this.selectedContributor.repositories[e],
              repositoryName: e
            }
          })

          repositoriesArray.sort((a, b) => b.number - a.number)

          this.selectedContributor.repositories = repositoriesArray
          this.selectedContributor.sortedRepositories = true
        }

        if (this.$refs['selected-contributor-modal']) {
          this.$refs['selected-contributor-modal'].show()

          window.history.pushState(
            this.selectedContributor.login,
            'PrestaShop Contributors',
            `/#${this.selectedContributor.login}`
          )
        }
      })

      window.onpopstate = () => {
        this.showSelectedContributor()
      }
    },
    methods: {
      findAnchor() {
        const result = window.location.href.split('#')

        return result[1]
      },
      fetchData() {
        const self = this
        const req = new XMLHttpRequest()
        req.open('GET', '/contributors.js', true)

        req.onreadystatechange = function () {
          if (req.status >= 200 && req.status < 400 && req.readyState === 4) {
            const contributors = JSON.parse(req.responseText)
            delete contributors.updatedAt

            Object.values(contributors).map((contributor, index) => {
              contributor.rank = ++index
              self.contributors.push(contributor)
            })

            self.showSelectedContributor()

            self.loading = false
          }
        }

        req.send()
      },
      closeModal() {
        this.$refs['selected-contributor-modal'].hide()
        this.resetUrl()
      },
      resetUrl() {
        window.history.pushState('index', 'PrestaShop Contributors', `/`)
      },
      showSelectedContributor() {
        const self = this
        const nameParam = self.findAnchor()

        if (!nameParam) {
          self.$refs['selected-contributor-modal'].hide()
          return
        }

        self.contributors.forEach((contributor) => {
          if (contributor.login === nameParam) {
            if (!contributor.sortedRepositories) {
              let repositoriesArray = []
              const tempArray = Object.keys(contributor.repositories)
              repositoriesArray = tempArray.map((e) => {
                repositoriesArray[e] = contributor.repositories[e]

                return {
                  number: contributor.repositories[e],
                  repositoryName: e
                }
              })

              repositoriesArray.sort((a, b) => b.number - a.number)

              contributor.repositories = repositoriesArray
              contributor.sortedRepositories = true
            }

            self.selectedContributor = contributor
            self.$refs['selected-contributor-modal'].show()
          }
        })
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
      max-width: 100px;
    }
  }

  .modal-header {
    height: auto;
  }
</style>
