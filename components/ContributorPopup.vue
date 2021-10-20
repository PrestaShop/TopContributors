<template>
  <div class="contributor-modal">
    <div class="contributor-modal-left col-md-3">
      <div class="contributor-modal-left-top">
        <div class="contributor-informations">
          <b-avatar size="75px" :src="contributor.avatar_url" />

          <p class="contributor-name">
            {{ contributorName }} (#{{ contributor.rank }})
          </p>

          <p v-if="contributor.location" class="contributor-location">
            <b-icon-geo-alt-fill></b-icon-geo-alt-fill>
            {{ contributor.location }}
          </p>
        </div>

        <contributor-roles
          v-if="contributor.company"
          :contributor="contributor"
        />
      </div>

      <contributor-links :contributor="contributor" />
    </div>

    <div class="contributor-modal-right col-md-9">
      <div class="contributor-modal-right-top-bar">
        <div class="contributor-modal-choices">
          <button
            class="contributor-modal-choice"
            :class="{ active: contentId === 'contributions' }"
            @click="selectContent('contributions')"
          >
            CONTRIBUTIONS ({{ contributor.contributions }})
          </button>

          <button
            v-if="contributor.bio && contributor.bio !== ''"
            class="contributor-modal-choice"
            :class="{ active: contentId === 'about' }"
            @click="selectContent('about')"
          >
            ABOUT
          </button>
        </div>

        <div class="contributor-modal-content-header-right">
          <copy-button :contributor="contributor" />

          <b-icon-x class="icon-close" @click="$emit('close-modal')"></b-icon-x>
        </div>
      </div>

      <div class="contributor-modal-content">
        <p
          v-if="contentId === 'category'"
          class="contributor-modal-back"
          @click="selectContent('contributions')"
        >
          <b-icon-arrow-left-short class="icon-close"></b-icon-arrow-left-short>
          Back
        </p>

        <div
          v-if="contentId === 'contributions'"
          class="contributor-modal-content-contributions"
        >
          <ul>
            <li v-for="(category, key) of contributor.categories" :key="key">
              <category
                :text="categoriesDatas[key].text"
                :category="category"
                :contributor="contributor"
                :type="'category'"
                @select="selectCategory(category)"
              />
            </li>
          </ul>
        </div>

        <div
          v-if="contentId === 'about'"
          class="contributor-modal-content-about"
        >
          {{ contributor.bio }}
        </div>

        <div
          v-if="contentId === 'category' && selectedCategory"
          class="contributor-modal-content-contributions"
        >
          <ul>
            <li
              v-for="(repository, key) of selectedCategory.repositories"
              :key="key"
            >
              <category
                :text="key"
                :contributor="contributor"
                :type="'repository'"
                :number="repository"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="typescript">
  import {BAvatar, BIconGeoAltFill, BIconX, BIconArrowLeftShort} from 'bootstrap-vue'
  import ContributorRoles from './ContributorRoles'
  import ContributorLinks from './ContributorLinks'
  import CopyButton from './CopyButton'
  import categoriesDatas from '~/constants/categories';

  export default {
    name: 'ContributorPopup',
    components: {
      BIconGeoAltFill,
      BAvatar,
      BIconX,
      BIconArrowLeftShort,
      ContributorRoles,
      ContributorLinks,
      CopyButton
    },
    props: {
      contributor: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        contentId: 'contributions',
        selectedCategory: null,
        categoriesDatas
      }
    },
    computed: {
      contributorName () {
        const name = this.contributor.name
          ? this.contributor.name
          : this.contributor.login
        if (name.length >= 21) {
          return  `${name.substr(0, 21)} (..)`
        }

        return name
      }
    },
    methods: {
      selectContent(contentId) {
        this.contentId = contentId;
      },
      selectCategory(category) {
        this.selectedCategory = category;
        this.contentId = 'category';
      }
    },
  }
</script>

<style lang="scss">
  #selectedContributorModal {
    .modal-dialog {
      max-width: 1036px;
      width: 100%;

      .modal-header {
        border-bottom: 0;
      }

      .modal-content {
        background-color: #f8f8f8;
        overflow: hidden;
        border-radius: 5px;
      }

      .modal-body {
        padding: 0;
      }
    }
  }

  .contributor {
    &-modal {
      display: flex;
      align-items: flex-start;
      position: relative;

      &::after {
        content: '';
        width: 100%;
        max-width: 25%;
        background: white;
        top: 0;
        height: 100%;
        position: absolute;
        left: 0;
        pointer-events: none;
        z-index: 0;
      }

      &-back {
        font-size: 12px;
        position: absolute;
        top: -25px;
        display: flex;
        align-items: center;
        font-weight: 600;
        color: #7d7d7d;
        text-transform: uppercase;
        transition: 0.25s ease-out;
        cursor: pointer;

        &:hover {
          opacity: 0.6;
        }

        svg {
          width: 20px;
          height: 15px;
          margin-bottom: 1px;
        }
      }

      &-content {
        padding: 0 10px;
        padding-bottom: 20px;
        position: relative;

        &-header-right {
          display: flex;
          align-items: center;
        }

        &-contributions {
          ul {
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            margin: -7.5px;

            li {
              list-style-type: none;
            }
          }
        }
      }

      &-choices {
        button {
          border: 0;
          background: none;
          color: #2e2e2e;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0;
          line-height: 22px;
          transition: 0.25s ease-out;
          position: relative;
          padding: 2px 0;
          margin: 0 10px;

          &:focus {
            outline: 0;
          }

          &::after {
            content: '';
            height: 1px;
            width: 100%;
            border-radius: 0.5px;
            background-color: #4d4d4d;
            opacity: 0;
            transition: 0.25s ease-out;
            bottom: 0;
            left: 0;
            position: absolute;
          }

          &:hover {
            opacity: 0.6;
          }

          &:not(.active) {
            color: #a9abae;
          }

          &.active {
            &::after {
              opacity: 1;
            }
          }
        }
      }

      &-image {
        width: 75px;
        height: 75px;
        border-radius: 50%;
      }

      &-left {
        background-color: white;
        padding: 50px 0;
        min-height: 630px;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        position: relative;
        z-index: 1;

        &.col-md-3 {
          padding-left: 55px;
          padding-right: 55px;
        }
      }

      &-right {
        &-top-bar {
          display: flex;
          justify-content: space-between;
          padding: 32px 10px;

          button:first-child {
            margin-left: 0;
          }

          .icon-close {
            width: 30px;
            height: 30px;
            fill: #2e2e2e;
            cursor: pointer;
            transition: 0.25s ease-out;

            &:hover {
              opacity: 0.6;
            }
          }
        }
      }
    }

    &-informations {
      text-align: center;
      margin-bottom: 30px;
    }

    &-location {
      margin: 0;
      color: #2e2e2e;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 19px;
      font-weight: 600;

      svg {
        fill: #4d4d4d;
        width: 17px;
        height: 17px;
      }
    }

    &-name {
      color: #2e2e2e;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 24px;
      margin: 16px 0;
    }
  }
</style>
