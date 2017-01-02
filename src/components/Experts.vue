<template>
    <div>
        <section-header category="experts" title="Experts (More than 25 contrib.)" v-bind:stars="3"></section-header>
        <avatar v-for="contributor in contributors" v-bind:contributor="contributor"></avatar>
    </div>
</template>

<script>
    import TitleOfSection from './ui/TitleOfSection.vue'
    import Avatar from './ui/Avatar.vue'

    export default{
        name: 'Experts',
        props: [
            'contributors',
        ],
        components: {
            'section-header': TitleOfSection,
            'avatar': Avatar
        }
    }
</script>
