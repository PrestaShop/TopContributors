<template>
    <div id="top-translators" class="row main-content">
        <div>
            <div className="col-md-10">
                <h2 className="text-md-center">Top contributors:</h2>
                <div className="text-md-center date">Last update: <strong>{{ date }}</strong></div>
            </div>
            <div className="col-md-4">
                {{ leftColumn }}
            </div>
            <div className="col-md-2">
                <arrow-component v-bind:message="counts" />
            </div>
            <div className="col-md-4 right-column">
                {{ rightColumn }}
            </div>
        </div>
        <experts-component></experts-component>
        <enthusiasts-component></enthusiasts-component>
        <beginners-component></beginners-component>
    </div>
</template>

<style>
</style>

<script>
    // Main components
    import ExpertsComponent from './Experts.vue'
    import EnthusiastsComponent from './Enthusiasts.vue'
    import BeginnersComponent from './Beginners.vue'

    // UI components
    import ArrowComponent from './ui/Arrow.vue'

    export default{
        name: 'topContributors',
        data(){
            return{
               date:'1st fo January, 2017',
               leftColumn: [],
               rightColumn: [],
               counts: [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000]
            }
        },
        components:{
            'experts-component':ExpertsComponent,
            'enthusiasts-component': EnthusiastsComponent,
            'beginners-component': BeginnersComponent,
            'arrow-component': ArrowComponent
        }
    }
</script>
