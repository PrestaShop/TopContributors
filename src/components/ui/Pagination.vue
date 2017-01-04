<template>
    <div class="text-md-center beginners-pagination">
        <span v-for="(page, index) in pages"><a v-on:click.prevent="select(index)" href="#">{{ index +1 }}</a></span>
    </div>
</template>
<script>
    export default{
        name: 'pagination',
        props: ['pages'],
        computed: function (page) {
            return '#'+page;
        },
        methods: {
            select: function(index) {
                this.$emit('select-page', index +1);
            }
        }
    }
</script>
