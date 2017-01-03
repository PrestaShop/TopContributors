<template>
    <div class="col-md-2 contributor simple-contributor">
        <div class="avatar">
            <img :src="contributor.avatar_url" />
        </div>
        <div class="details">
            <div class="fixed-height">
                <div class="name">{{ contributorName }}</div>
                <div class="username"><a :href="contributorBlogLink">{{ contributor.login }}</a></div>
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
