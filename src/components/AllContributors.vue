<template>
    <div>
        <div id="all-contributors" class="col-md-12">
            <Experts v-bind:contributors="experts"></Experts>
            <Enthusiasts v-bind:contributors="enthusiasts"></Enthusiasts>
            <Beginners v-bind:contributors="beginners"></Beginners>
        </div>
    </div>
</template>

<script>
    import ExpertsComponent from './Experts.vue'
    import EnthusiastsComponent from './Enthusiasts.vue'
    import BeginnersComponent from './Beginners.vue'

    export default{
        name: 'allContributors',
        components: {
            'Experts': ExpertsComponent,
            'Enthusiasts': EnthusiastsComponent,
            'Beginners': BeginnersComponent
        },
        computed: {
            experts: function () {
                return this.contributors.filter((contributor) => {
                    return contributor.rank > 10 & contributor.contributions > 25;
                });
            },
            enthusiasts: function () {
                return this.contributors.filter((contributor) => {
                    return contributor.rank > 10 &
                    contributor.contributions <= 25 &
                    contributor.contributions > 5;
                });
            },
            beginners: function () {
                return this.contributors.filter((contributor) => {
                    return contributor.rank > 10 & contributor.contributions <= 5;
                });
            }
        },
        props: [
            'contributors',
        ]
    }
</script>
