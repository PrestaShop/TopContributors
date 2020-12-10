<template>
  <div class="copy-container">
    <button class="copy-button" @click="copyLink">
      {{ text }}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
        />
      </svg>
    </button>

    <textarea :value="shareUrl" />
  </div>
</template>

<script lang="typescript">
  export default {
    name: 'CopyButton',
    props: {
      contributor: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        text: 'Copy this link'
      }
    },
    computed: {
      shareUrl() {
        return `${window.location.origin}/#${this.contributor.login}`;
      }
    },
    methods: {
      copyLink() {
        const self = this;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(this.shareUrl).then(function() {
            self.text = 'Copied!';

            setTimeout(() => {
              self.text = 'Copy this link';
            }, 2000)
          }, function(err) {
            // eslint-disable-next-line
            console.error('Error while copying', err);
          });
        } else {
          const textArea = document.querySelector('.copy-container textarea');
          textArea.focus();
          textArea.select();

          try {
            document.execCommand('copy');
            self.text = 'Copied!';

            setTimeout(() => {
              self.text = 'Copy this link';
            }, 2000)
          } catch (err) {
            // eslint-disable-next-line
            console.error('Fallback: Oops, unable to copy', err);
          }

        }
      }
    }
  }
</script>

<style lang="scss">
  .copy-button {
    border: 1px solid #7f8793;
    border-radius: 4px;
    background-color: #ffffff;
    color: #7f8793;
    font-size: 13px;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 600;
    transition: 0.25s ease-out;
    display: flex;
    align-items: center;
    padding: 6px 15px;
    margin-right: 30px;

    &:focus {
      outline: 0;
    }

    &:hover {
      background-color: #7f8793;
      color: white;

      svg {
        fill: #fff;
      }
    }

    svg {
      transition: 0.25s ease-out;
      fill: #7f8793;
      height: 18px;
      width: 18px;
      margin-left: 12px;
    }
  }

  .copy-container {
    textarea {
      width: 0;
      height: 0;
      opacity: 0;
      position: absolute;
    }
  }
</style>
