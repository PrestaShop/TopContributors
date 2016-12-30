<template>
    <div>
        <div id="sees" class="col-md-8 push-md-1 see-more text-md-center" @click="toggleBlock">
            <span class="more">See more</span>
            <span class="less">See less</span>
        </div>
        <div id="contributors" class="col-md-10 collapse">
            <div class="row">
                <Experts></Experts>
                <Enthusiasts></Enthusiasts>
                <Beginners></Beginners>
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
        methods: {
            toggleBlock: function () {
                let sees = document.querySelectorAll('.see-more');
                let contributorsBlock = document.querySelector('#contributors');

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
