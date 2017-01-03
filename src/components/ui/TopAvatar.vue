<template>
    <div class="contributor top-contributor">
        <div class="avatar">
            <img :src="contributor.avatar_url" />
        </div>
        <div class="details">
            <div class="position">#{{ contributor.rank }}</div>
            <div class="name">{{ contributorName }}</div>
            <div class="info"><a :href="contributorBlogLink">{{ contributor.login }}</a></div>
            <div class="links">
                <a v-if="contributorBlogLink" :href="contributorBlogLink">
                    <svg class="icon icon-link" fill="#000000" height="24" viewBox="0 0 24 24" width="24" transform="rotate(-45)">
                        <path transform="rotate(-45 12 12)" d="M0 0h24v24H0z" fill="none"></path><path transform="rotate(-45 12 12)" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
                    </svg>
                </a>
                <a v-if="contributorGitHubLink" :href="contributorGitHubLink">
                    <svg className="icon icon-github" height="18" version="1.1" viewBox="0 0 16 16" width="18">
                        <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                </a>
            </div>
        </div>
        <div class="dots">
            <div class="dot" />
            <div class="dot" />
            <div class="dot" />
        </div>
    </div>
</template>

<script>
import TopAvatar from './TopAvatar.vue'
export default{

    name: 'top-avatar',
    props: ['contributor'],
    computed: {
        contributorName: function() {
            let name = this.contributor.name ? this.contributor.name : this.contributor.login;
            if (name.length >= 21) {
                return name.substr(0, 21) +' (..)';
            }
            return name;
        },
        contributorBlogLink: function() {
            return this.contributor.blog !== '' ? this.contributor.blog : false;
        },
        contributorGitHubLink: function() {
            return this.contributor.html_url !== '' ? this.contributor.html_url : false;
        }
    }
}
</script>
