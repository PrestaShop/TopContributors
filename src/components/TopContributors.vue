<template>
    <div id="top-contributors" class="row main-content">
        <div>
            <div class="col-md-10">
                <h2 class="text-md-center">Top contributors:</h2>
                <div class="text-md-center date">Last update: <strong>{{ date }}</strong></div>
            </div>
            <div class="col-md-4">
                <top-avatar v-for="contributor in leftContributors" v-bind:contributor="contributor"></top-avatar>
            </div>
            <div class="col-md-2">
                <arrow v-bind:counts="counts"></arrow>
            </div>
            <div class="col-md-4 right-column">
                <top-avatar v-for="contributor in rightContributors" v-bind:contributor="contributor"></top-avatar>
            </div>
        </div>
        <see-more v-bind:contributors="contributors"></see-more>
    </div>
</template>

<script>
    import ArrowComponent from './ui/Arrow.vue'
    import TopAvatarComponent from './ui/TopAvatar.vue'
    import SeeMoreComponent from './ui/SeeMore.vue'

    export default{
        name: 'topContributors',
        data(){
            return{
                date:'1st fo January, 2017',
                contributors: []
            }
        },
        created: function () {
            this.fetchData();
        },
        computed: {
            counts: function () {
                let counts = [];
                this.topContributors.forEach((contributor) => {
                   counts.push(contributor.contributions);
                });

                return counts;
            },
            topContributors: function() {
                return this.contributors.slice(0, 10);
            },
            leftContributors: function() {
                let leftContributors = [];
                this.topContributors.forEach((contributor, index) => {
                    if (index % 2) {
                        return;
                    }
                    leftContributors.push(contributor);
                });

                return leftContributors;
            },
            rightContributors: function() {
                let rightContributors = [];
                this.topContributors.forEach((contributor, index) => {
                    if (index % 2) {
                        rightContributors.push(contributor);
                    }
                });

                return rightContributors;
            },
        },
        components:{
            'arrow': ArrowComponent,
            'top-avatar': TopAvatarComponent,
            'see-more': SeeMoreComponent
        },
        methods: {
            fetchData: function () {
                let self = this;
                let req = new XMLHttpRequest();
                req.open('GET', 'http://localhost:9615', true);

                req.onreadystatechange = function () {
                    if (req.status >= 200 && req.status < 400 && req.readyState == 4) {
                        let contributors = JSON.parse(req.responseText);
                        contributors.forEach((contributor, index) => {
                            contributor.rank = ++index;
                            self.contributors.push(contributor);
                        });
                    }
                }

                req.send();
            }
        }
    }
</script>
