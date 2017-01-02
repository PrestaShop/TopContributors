<template>
    <div>
        <section-header category="beginners" title="Beginners (1 to 4 contrib.)" v-bind:stars="1"></section-header>
        <avatar v-for="contributor in contributors" v-bind:contributor="contributor"></avatar>
    </div>
</template>

<script>
    import TitleOfSection from './ui/TitleOfSection.vue'
    import Avatar from './ui/Avatar.vue'

    export default{
        name: 'Beginners',
        props: [
            'contributors',
        ],
        components: {
            'section-header': TitleOfSection,
            'avatar': Avatar
        }
    }
</script>
