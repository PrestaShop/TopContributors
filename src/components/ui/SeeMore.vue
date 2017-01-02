<template>
    <div>
        <div id="sees" class="col-md-8 push-md-1 see-more text-md-center" @click="toggleBlock">
            <span class="more">See more</span>
            <span class="less">See less</span>
        </div>
        <div id="all-contributors" class="col-md-10 collapse">
            <div class="row">
                <Experts v-bind:contributors="experts"></Experts>
                <Enthusiasts v-bind:contributors="enthusiasts"></Enthusiasts>
                <Beginners v-bind:contributors="beginners"></Beginners>
                <div class="col-md-8 push-md-1 see-more text-md-center" @click="toggleBlock">
                    <span class="more">See more</span>
                    <span class="less">See less</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // Main components
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
                return this.contributors.slice(11, 15);
            },
            enthusiasts: function () {
                return this.contributors.slice(16, 30);
            },
            beginners: function () {
                return this.contributors.slice(31);
            }
        },
        props: [
            'contributors',
        ],
        methods: {
            toggleBlock: function () {
                let sees = document.querySelectorAll('.see-more');
                let contributorsBlock = document.querySelector('#all-contributors');

                sees.forEach((see) => {
                    if (see.classList.contains('open')) {
                        contributorsBlock.classList.add('collapse');
                        see.classList.remove('open');
                    }else {
                        contributorsBlock.classList.remove('collapse');
                        see.classList.add('open');
                    }
                });


            }
        }
    }
</script>
