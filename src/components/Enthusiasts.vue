<template>
    <div>
        <section-header category="enthusiasts" title="Enthusiasts (6 to 25 contrib.)" v-bind:stars="2"></section-header>
        <div class="row col-10 offset-1 pb-4">
            <avatar
                v-for="contributor in contributors"
                v-bind:contributor="contributor"
                category="rank-enthusiasts"
                :key="contributor.login"
            ></avatar>
        </div>
    </div>
</template>

<script>
    import TitleOfSection from './ui/TitleOfSection.vue'
    import Avatar from './ui/Avatar.vue'

    export default{
        name: 'Enthusiasts',
        props: [
            'contributors',
        ],
        components: {
            'section-header': TitleOfSection,
            'avatar': Avatar
        }
    }
</script>
