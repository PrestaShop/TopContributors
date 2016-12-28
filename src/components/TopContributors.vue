<template>
    <div>
        <header-component/>
        <div>this is template body</div>
        <experts-component></experts-component>
        <enthusiasts-component></enthusiasts-component>
        <beginners-component></beginners-component>
    </div>
</template>

<style>
</style>

<script>
    import ExpertsComponent from './Experts.vue'
    import EnthusiastsComponent from './Enthusiasts.vue'
    import BeginnersComponent from './Beginners.vue'
    export default{
        name: 'topContributors',
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{
            'experts-component':ExpertsComponent,
            'enthusiasts-component': EnthusiastsComponent,
            'beginners-component': BeginnersComponent
        }
    }
</script>
