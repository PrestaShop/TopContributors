<template>
    <div>
        <section-header category="beginners" title="Beginners (1 to 5 contrib.)" v-bind:stars="1"></section-header>
        <ul id="newbie-contributors-list" class="col-md-12">
            <avatar-item
                v-for="contributor in contributors"
                v-bind:contributor="contributor"
                :key="contributor.login"
                category="rank-beginners"
            ></avatar-item>
        </ul>
    </div>
</template>

<script>
    import TitleOfSection from './ui/TitleOfSection.vue'
    import AvatarItem from './ui/AvatarItem.vue'

    export default{
        name: 'Beginners',
        props: [
            'contributors',
        ],
        components: {
            'section-header': TitleOfSection,
            'avatar-item': AvatarItem
        }
    }
</script>
