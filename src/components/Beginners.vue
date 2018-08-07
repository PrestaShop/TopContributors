<template>
    <div>
        <section-header category="beginners" title="Beginners (1 to 5 contrib.)" v-bind:stars="1"></section-header>
        <ul id="newbie-contributors-list" class="col-md-12">
            <avatar-item
                v-for="contributor in displayedContributors"
                v-bind:contributor="contributor"
                :key="contributor.login"
                category="rank-beginners"
            ></avatar-item>
        </ul>
        <pagination :pages="pages()" v-on:select-page="displayBeginners"></pagination>
    </div>
</template>

<script>
    import TitleOfSection from './ui/TitleOfSection.vue'
    import AvatarItem from './ui/AvatarItem.vue'
    import Pagination from './ui/Pagination.vue'

    export default{
        name: 'Beginners',
        data(){
            return {
                pageIndex: 1
            }
        },
        props: [
            'contributors',
        ],
        computed: {
            displayedContributors: function() {
                let indice = this.pageIndex - 1;
                let start = 50*indice;
                let end = 50*(indice+1);

                return this.contributors.slice(start, end);
            }
        },
        components: {
            'section-header': TitleOfSection,
            'avatar-item': AvatarItem,
            'pagination': Pagination
        },
        methods: {
            displayBeginners: function(pageIndex) {
                this.pageIndex = pageIndex;
            },
            pages: function() {
                return Math.ceil(this.contributors.length / 50);
            }
        }
    }
</script>
