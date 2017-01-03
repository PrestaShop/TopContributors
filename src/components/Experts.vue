<template>
    <div>
        <section-header category="experts" title="Experts (More than 25 contrib.)" v-bind:stars="3"></section-header>
        <div class="col-md-10">
            <avatar v-for="contributor in contributors" v-bind:contributor="contributor" category="rank-experts"></avatar>
        </div>
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
