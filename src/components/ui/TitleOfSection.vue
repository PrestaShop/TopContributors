<template>
    <div :class="renderClasses">{{ title }}</div>
</template>
<style>

</style>
<script>
    export default{
        name: 'section-header',
        props: {
            title: {
                type: String,
                required: true
            },
            category: {
                type: String,
                required: true
            },
            stars: {
                type: Number,
                required: true
            }
        },
        computed: {
            renderClasses: function() {
                return 'col-md-10 title '+ this.category;
            }
        }
    }
</script>
