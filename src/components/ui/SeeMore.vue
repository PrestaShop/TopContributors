<template>
    <div>
        <div id="sees" class="col-md-12 see-more text-center" @click="toggleBlock">
            <span class="more">See more</span>
            <span class="less">See less</span>
        </div>
        <div id="all-contributors" class="col-md-12 collapse">
            <Experts v-bind:contributors="experts"></Experts>
            <Enthusiasts v-bind:contributors="enthusiasts"></Enthusiasts>
            <Beginners v-bind:contributors="beginners"></Beginners>
            <div class="col-md-12 see-more text-center" @click="toggleBlock">
                <span class="more">See more</span>
                <span class="less">See less</span>
            </div>
        </div>
    </div>
</template>

<script>
    import ExpertsComponent from './../Experts.vue'
    import EnthusiastsComponent from './../Enthusiasts.vue'
    import BeginnersComponent from './../Beginners.vue'

    export default{
        name: 'seeMore',
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
        ],
        methods: {
            toggleBlock: function () {
                let sees = document.querySelectorAll('.see-more');
                let contributorsBlock = document.querySelector('#all-contributors');

                for (var i = 0; i < sees.length; i++) {
                    let see = sees[i];
                    if (see.classList.contains('open')) {
                        contributorsBlock.classList.add('collapse');
                        see.classList.remove('open');
                    }else {
                        contributorsBlock.classList.remove('collapse');
                        see.classList.add('open');
                    }
                }
            }
        }
    }
</script>
