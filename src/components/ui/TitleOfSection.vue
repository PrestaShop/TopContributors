<template>
    <div :class="renderClasses">
        <img v-for="i in stars" src="./../../assets/img/star.png"> {{ title }} <img v-for="i in stars" src="./../../assets/img/star.png"></div>
</template>

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
