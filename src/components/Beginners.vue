<template>
    <div>
        <section-header category="beginners" title="Beginners (1 to 5 contrib.)" v-bind:stars="1"></section-header>
        <ul id="newbie-contributors-list" class="col-md-10">
            <avatar-item v-for="contributor in contributors" v-bind:contributor="contributor" category="rank-beginners"></avatar-item>
        </ul>
        <pagination pages="pages"></pagination>
    </div>
</template>

<script>
    import TitleOfSection from './ui/TitleOfSection.vue'
    import AvatarItem from './ui/AvatarItem.vue'
    import Pagination from './ui/Pagination.vue'

    export default{
        name: 'Beginners',
        props: [
            'contributors',
        ],
        computed: {
            pages: function() {
                return [Array(Math.ceil(this.contributors.length % 50)).keys()];
            }
        },
        components: {
            'section-header': TitleOfSection,
            'avatar-item': AvatarItem,
            'pagination': Pagination
        }
    }
</script>
