<template>
    <div>
        <section-header category="enthusiasts" title="Enthusiasts (5 to 30 contrib.)" v-bind:stars="2"></section-header>
        <avatar v-for="contributor in contributors" v-bind:contributor="contributor"></avatar>
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
