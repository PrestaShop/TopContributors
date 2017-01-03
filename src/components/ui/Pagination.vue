<template>
    <div>
        <span v-for="(page, index) in pages"><a href="#"> {{ index +1 }}</a></span>
    </div>
</template>
<script>
    export default{
        name: 'pagination',
        props: ['pages'],
        computed: function (page) {
            return '#'+page;
        }
    }
</script>
