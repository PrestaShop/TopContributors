<template>
    <div id="top-contributors" class="main-content">
        <div class="row">
            <div class="col-12">
                <h2 class="text-center">Top contributors:</h2>
                <div class="text-center date">Last update: <strong>{{ today }}</strong></div>
            </div>
            <div class="col-5 left-column">
                <top-avatar
                    v-for="contributor in leftContributors"
                    :contributor="contributor"
                    :key="contributor.login"
                ></top-avatar>
            </div>
            <div class="col-md-2">
                <arrow :counts="counts"></arrow>
            </div>
            <div class="col-md-5 right-column">
                <top-avatar
                    v-for="contributor in rightContributors"
                    :contributor="contributor"
                    :key="contributor.login"
                ></top-avatar>
            </div>
        </div>
        <all-contributors :contributors="contributors"></all-contributors>
    </div>
</template>

<script>
    import ArrowComponent from './ui/Arrow.vue'
    import TopAvatarComponent from './ui/TopAvatar.vue'
    import AllContributors from './AllContributors.vue'

    export default{
        name: 'topContributors',
        data(){
            return{
                contributors: []
            }
        },
        created: function () {
            this.fetchData();
        },
        computed: {
            counts: function () {
                let counts = [];
                this.topContributors.map((contributor) => {
                   counts.push(contributor.contributions);
                });

                return counts;
            },
            topContributors: function() {
                return this.contributors.slice(0, 10);
            },
            leftContributors: function() {
                let leftContributors = [];
                this.topContributors.map((contributor, index) => {
                    if (index % 2) {
                        return;
                    }
                    leftContributors.push(contributor);
                });

                return leftContributors;
            },
            rightContributors: function() {
                let rightContributors = [];
                this.topContributors.map((contributor, index) => {
                    if (index % 2) {
                        rightContributors.push(contributor);
                    }
                });

                return rightContributors;
            },
            today: function() {
                let date = new Date();
                let options = { year: 'numeric', month: 'long', day: 'numeric' };

                return date.toLocaleDateString('en-US', options);
            }
        },
        components:{
            'arrow': ArrowComponent,
            'top-avatar': TopAvatarComponent,
            'all-contributors': AllContributors
        },
        methods: {
            fetchData: function () {
                let self = this;
                let req = new XMLHttpRequest();
                req.open('GET', './static/contributors.js', true);

                req.onreadystatechange = function () {
                    if (req.status >= 200 && req.status < 400 && req.readyState === 4) {
                        let contributors = JSON.parse(req.responseText);
                        contributors.map((contributor, index) => {
                            contributor.rank = ++index;
                            self.contributors.push(contributor);
                        });
                    }
                };

                req.send();
            }
        }
    }
</script>
