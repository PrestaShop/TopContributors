<template>
    <div>
        <section-header category="beginners" title="Beginners (1 to 4 contrib.)" v-bind:stars="1"></section-header>
    </div>
</template>

<script>
    import TitleOfSection from './ui/TitleOfSection.vue'

    export default{
        name: 'Beginners',
        props: [
            'contributors',
        ],
        components: {
            'section-header': TitleOfSection
        }
    }
</script>
