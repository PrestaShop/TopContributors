<template>
    <div class="text-md-center beginners-pagination">
        <span v-for="(page, index) in pages"><a v-on:click.prevent="select(index)" href="#" :class="isActive(index)">{{ index +1 }}</a></span>
    </div>
</template>

<script>
    export default{
        name: 'pagination',
        props: ['pages'],
        data(){
            return {
                activePage: 1
            }
        },
        methods: {
            isActive: function(index) {
                if((index +1) === this.activePage) {
                    return 'active';
                }

                return '';
            },
            select: function(index) {
                let page = index + 1;
                this.activePage = page;
                this.$emit('select-page', page);
            }
        }
    }
</script>
