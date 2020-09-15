<template>
    <div class="col-2 contributor simple-contributor" :id="contributor.login">
        <div class="avatar">
            <img :src="contributor.avatar_url" />
        </div>
        <div class="details">
            <div class="fixed-height">
                <div class="name">{{ contributorName }}</div>
                <div class="username">
                    <a :href="contributorGitHubLink">{{ contributor.login }}</a>
                    <div v-if="contributorBlogLink" class="links">
                        |
                        <a :href="contributorBlogLink">
                            <svg class="icon icon-link" fill="#000000" height="12" viewBox="0 -1 24 18" width="12" transform="rotate(-45)">
                                <path transform="rotate(-45 12 12)" d="M0 0h24v24H0z" fill="none"></path><path transform="rotate(-45 12 12)" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div class="info">{{ contributor.contributions }} contrib.</div>
            <div :class="renderClasses">#{{ contributor.rank }}</div>
        </div>
    </div>
</template>

<script>
import TopAvatar from './TopAvatar.vue'
export default{
    extends: TopAvatar,
    name: 'avatar',
    props: ['contributor', 'category'],
    computed: {
        renderClasses: function() {
            return `position ${this.category}`;
        }
    }
}
</script>
