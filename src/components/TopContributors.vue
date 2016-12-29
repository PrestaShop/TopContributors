<template>
    <div id="top-translators" class="row main-content">
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
    import TopAvatarComponent from './ui/TopAvatar.vue'

    export default{
        name: 'topContributors',
        data(){
            return{
                date:'1st fo January, 2017',
                topContributors: [
                    {
                        "login": "gRoussac",
                        "id": 3099551,
                        "avatar_url": "https:\/\/avatars.githubusercontent.com\/u\/3099551?v=3",
                        "gravatar_id": "",
                        "url": "https:\/\/api.github.com\/users\/gRoussac",
                        "html_url": "https:\/\/github.com\/gRoussac",
                        "followers_url": "https:\/\/api.github.com\/users\/gRoussac\/followers",
                        "following_url": "https:\/\/api.github.com\/users\/gRoussac\/following{\/other_user}",
                        "gists_url": "https:\/\/api.github.com\/users\/gRoussac\/gists{\/gist_id}",
                        "starred_url": "https:\/\/api.github.com\/users\/gRoussac\/starred{\/owner}{\/repo}",
                        "subscriptions_url": "https:\/\/api.github.com\/users\/gRoussac\/subscriptions",
                        "organizations_url": "https:\/\/api.github.com\/users\/gRoussac\/orgs",
                        "repos_url": "https:\/\/api.github.com\/users\/gRoussac\/repos",
                        "events_url": "https:\/\/api.github.com\/users\/gRoussac\/events{\/privacy}",
                        "received_events_url": "https:\/\/api.github.com\/users\/gRoussac\/received_events",
                        "type": "User",
                        "site_admin": false,
                        "name": "Gregory Roussac",
                        "company": "@ByteInternet",
                        "blog": "https:\/\/www.byte.nl\/",
                        "location": "Amsterdam",
                        "email": null,
                        "hireable": true,
                        "bio": "@ByteInternet",
                        "public_repos": 35,
                        "public_gists": 1,
                        "followers": 50,
                        "following": 156,
                        "created_at": "2012-12-21T16:37:12Z",
                        "updated_at": "2016-11-28T17:20:45Z",
                        "contributions": 4655
                    },
                    {
                        "login": "rGaillard",
                        "id": 2787216,
                        "avatar_url": "https:\/\/avatars.githubusercontent.com\/u\/2787216?v=3",
                        "gravatar_id": "",
                        "url": "https:\/\/api.github.com\/users\/rGaillard",
                        "html_url": "https:\/\/github.com\/rGaillard",
                        "followers_url": "https:\/\/api.github.com\/users\/rGaillard\/followers",
                        "following_url": "https:\/\/api.github.com\/users\/rGaillard\/following{\/other_user}",
                        "gists_url": "https:\/\/api.github.com\/users\/rGaillard\/gists{\/gist_id}",
                        "starred_url": "https:\/\/api.github.com\/users\/rGaillard\/starred{\/owner}{\/repo}",
                        "subscriptions_url": "https:\/\/api.github.com\/users\/rGaillard\/subscriptions",
                        "organizations_url": "https:\/\/api.github.com\/users\/rGaillard\/orgs",
                        "repos_url": "https:\/\/api.github.com\/users\/rGaillard\/repos",
                        "events_url": "https:\/\/api.github.com\/users\/rGaillard\/events{\/privacy}",
                        "received_events_url": "https:\/\/api.github.com\/users\/rGaillard\/received_events",
                        "type": "User",
                        "site_admin": false,
                        "name": "R\u00e9mi Gaillard",
                        "company": "PrestaShop",
                        "blog": null,
                        "location": "Paris",
                        "email": "remi.gaillard@prestashop.com",
                        "hireable": null,
                        "bio": null,
                        "public_repos": 10,
                        "public_gists": 0,
                        "followers": 57,
                        "following": 6,
                        "created_at": "2012-11-13T13:41:57Z",
                        "updated_at": "2016-12-13T22:18:44Z",
                        "contributions": 3154
                    },
                    {
                        "login": "vAugagneur",
                        "id": 2778997,
                        "avatar_url": "https:\/\/avatars.githubusercontent.com\/u\/2778997?v=3",
                        "gravatar_id": "",
                        "url": "https:\/\/api.github.com\/users\/vAugagneur",
                        "html_url": "https:\/\/github.com\/vAugagneur",
                        "followers_url": "https:\/\/api.github.com\/users\/vAugagneur\/followers",
                        "following_url": "https:\/\/api.github.com\/users\/vAugagneur\/following{\/other_user}",
                        "gists_url": "https:\/\/api.github.com\/users\/vAugagneur\/gists{\/gist_id}",
                        "starred_url": "https:\/\/api.github.com\/users\/vAugagneur\/starred{\/owner}{\/repo}",
                        "subscriptions_url": "https:\/\/api.github.com\/users\/vAugagneur\/subscriptions",
                        "organizations_url": "https:\/\/api.github.com\/users\/vAugagneur\/orgs",
                        "repos_url": "https:\/\/api.github.com\/users\/vAugagneur\/repos",
                        "events_url": "https:\/\/api.github.com\/users\/vAugagneur\/events{\/privacy}",
                        "received_events_url": "https:\/\/api.github.com\/users\/vAugagneur\/received_events",
                        "type": "User",
                        "site_admin": false,
                        "name": "Vincent Augagneur",
                        "company": "Profileo",
                        "blog": "http:\/\/www.profileo.com",
                        "location": "Paris, France",
                        "email": "vincent.augagneur@profileo.com",
                        "hireable": null,
                        "bio": null,
                        "public_repos": 3,
                        "public_gists": 0,
                        "followers": 28,
                        "following": 0,
                        "created_at": "2012-11-12T14:52:37Z",
                        "updated_at": "2016-12-20T09:04:11Z",
                        "contributions": 2276
                    },
                    {
                        "login": "raphaelMalie",
                        "id": 2374154,
                        "avatar_url": "https:\/\/avatars.githubusercontent.com\/u\/2374154?v=3",
                        "gravatar_id": "",
                        "url": "https:\/\/api.github.com\/users\/raphaelMalie",
                        "html_url": "https:\/\/github.com\/raphaelMalie",
                        "followers_url": "https:\/\/api.github.com\/users\/raphaelMalie\/followers",
                        "following_url": "https:\/\/api.github.com\/users\/raphaelMalie\/following{\/other_user}",
                        "gists_url": "https:\/\/api.github.com\/users\/raphaelMalie\/gists{\/gist_id}",
                        "starred_url": "https:\/\/api.github.com\/users\/raphaelMalie\/starred{\/owner}{\/repo}",
                        "subscriptions_url": "https:\/\/api.github.com\/users\/raphaelMalie\/subscriptions",
                        "organizations_url": "https:\/\/api.github.com\/users\/raphaelMalie\/orgs",
                        "repos_url": "https:\/\/api.github.com\/users\/raphaelMalie\/repos",
                        "events_url": "https:\/\/api.github.com\/users\/raphaelMalie\/events{\/privacy}",
                        "received_events_url": "https:\/\/api.github.com\/users\/raphaelMalie\/received_events",
                        "type": "User",
                        "site_admin": false,
                        "name": "Rapha\u00ebl Mali\u00e9",
                        "company": "TousVoisins",
                        "blog": null,
                        "location": "Paris",
                        "email": null,
                        "hireable": null,
                        "bio": null,
                        "public_repos": 6,
                        "public_gists": 1,
                        "followers": 10,
                        "following": 0,
                        "created_at": "2012-09-18T22:39:22Z",
                        "updated_at": "2016-12-19T04:11:41Z",
                        "contributions": 1618
                    },
                    {
                        "login": "julienbourdeau",
                        "id": 1525636,
                        "avatar_url": "https:\/\/avatars.githubusercontent.com\/u\/1525636?v=3",
                        "gravatar_id": "",
                        "url": "https:\/\/api.github.com\/users\/julienbourdeau",
                        "html_url": "https:\/\/github.com\/julienbourdeau",
                        "followers_url": "https:\/\/api.github.com\/users\/julienbourdeau\/followers",
                        "following_url": "https:\/\/api.github.com\/users\/julienbourdeau\/following{\/other_user}",
                        "gists_url": "https:\/\/api.github.com\/users\/julienbourdeau\/gists{\/gist_id}",
                        "starred_url": "https:\/\/api.github.com\/users\/julienbourdeau\/starred{\/owner}{\/repo}",
                        "subscriptions_url": "https:\/\/api.github.com\/users\/julienbourdeau\/subscriptions",
                        "organizations_url": "https:\/\/api.github.com\/users\/julienbourdeau\/orgs",
                        "repos_url": "https:\/\/api.github.com\/users\/julienbourdeau\/repos",
                        "events_url": "https:\/\/api.github.com\/users\/julienbourdeau\/events{\/privacy}",
                        "received_events_url": "https:\/\/api.github.com\/users\/julienbourdeau\/received_events",
                        "type": "User",
                        "site_admin": false,
                        "name": "Julien Bourdeau",
                        "company": "PrestaShop",
                        "blog": "http:\/\/www.sigerr.org",
                        "location": "Paris, France",
                        "email": "julien@sigerr.org",
                        "hireable": true,
                        "bio": "Software engineer, mostly interested in web technologies and open source.",
                        "public_repos": 43,
                        "public_gists": 64,
                        "followers": 44,
                        "following": 2,
                        "created_at": "2012-03-11T12:56:58Z",
                        "updated_at": "2016-12-10T05:44:40Z",
                        "contributions": 1581
                    },
                    {
                        "login": "NinjaOfWeb",
                        "id": 2857801,
                        "avatar_url": "https:\/\/avatars.githubusercontent.com\/u\/2857801?v=3",
                        "gravatar_id": "",
                        "url": "https:\/\/api.github.com\/users\/NinjaOfWeb",
                        "html_url": "https:\/\/github.com\/NinjaOfWeb",
                        "followers_url": "https:\/\/api.github.com\/users\/NinjaOfWeb\/followers",
                        "following_url": "https:\/\/api.github.com\/users\/NinjaOfWeb\/following{\/other_user}",
                        "gists_url": "https:\/\/api.github.com\/users\/NinjaOfWeb\/gists{\/gist_id}",
                        "starred_url": "https:\/\/api.github.com\/users\/NinjaOfWeb\/starred{\/owner}{\/repo}",
                        "subscriptions_url": "https:\/\/api.github.com\/users\/NinjaOfWeb\/subscriptions",
                        "organizations_url": "https:\/\/api.github.com\/users\/NinjaOfWeb\/orgs",
                        "repos_url": "https:\/\/api.github.com\/users\/NinjaOfWeb\/repos",
                        "events_url": "https:\/\/api.github.com\/users\/NinjaOfWeb\/events{\/privacy}",
                        "received_events_url": "https:\/\/api.github.com\/users\/NinjaOfWeb\/received_events",
                        "type": "User",
                        "site_admin": false,
                        "name": "NinjaOfWeb",
                        "company": null,
                        "blog": "www.ninja-of-web.fr",
                        "location": "Palaiseau",
                        "email": "contact@ninja-of-web.fr",
                        "hireable": null,
                        "bio": null,
                        "public_repos": 2,
                        "public_gists": 0,
                        "followers": 9,
                        "following": 1,
                        "created_at": "2012-11-21T22:56:24Z",
                        "updated_at": "2016-12-02T10:02:33Z",
                        "contributions": 1542
                    },
                    {
                        "login": "maximebiloe",
                        "id": 2203436,
                        "avatar_url": "https:\/\/avatars.githubusercontent.com\/u\/2203436?v=3",
                        "gravatar_id": "",
                        "url": "https:\/\/api.github.com\/users\/maximebiloe",
                        "html_url": "https:\/\/github.com\/maximebiloe",
                        "followers_url": "https:\/\/api.github.com\/users\/maximebiloe\/followers",
                        "following_url": "https:\/\/api.github.com\/users\/maximebiloe\/following{\/other_user}",
                        "gists_url": "https:\/\/api.github.com\/users\/maximebiloe\/gists{\/gist_id}",
                        "starred_url": "https:\/\/api.github.com\/users\/maximebiloe\/starred{\/owner}{\/repo}",
                        "subscriptions_url": "https:\/\/api.github.com\/users\/maximebiloe\/subscriptions",
                        "organizations_url": "https:\/\/api.github.com\/users\/maximebiloe\/orgs",
                        "repos_url": "https:\/\/api.github.com\/users\/maximebiloe\/repos",
                        "events_url": "https:\/\/api.github.com\/users\/maximebiloe\/events{\/privacy}",
                        "received_events_url": "https:\/\/api.github.com\/users\/maximebiloe\/received_events",
                        "type": "User",
                        "site_admin": false,
                        "name": "Maxime Bilo\u00e9",
                        "company": "@PrestaShop ",
                        "blog": "https:\/\/twitter.com\/maximebiloe",
                        "location": "Paris, France",
                        "email": null,
                        "hireable": null,
                        "bio": "Core Developer @ PrestaShop",
                        "public_repos": 71,
                        "public_gists": 0,
                        "followers": 27,
                        "following": 4,
                        "created_at": "2012-08-23T10:58:24Z",
                        "updated_at": "2016-12-22T15:37:42Z",
                        "contributions": 1338
                    },
                    {
                        "login": "djfm",
                        "id": 1460499,
                        "avatar_url": "https:\/\/avatars.githubusercontent.com\/u\/1460499?v=3",
                        "gravatar_id": "",
                        "url": "https:\/\/api.github.com\/users\/djfm",
                        "html_url": "https:\/\/github.com\/djfm",
                        "followers_url": "https:\/\/api.github.com\/users\/djfm\/followers",
                        "following_url": "https:\/\/api.github.com\/users\/djfm\/following{\/other_user}",
                        "gists_url": "https:\/\/api.github.com\/users\/djfm\/gists{\/gist_id}",
                        "starred_url": "https:\/\/api.github.com\/users\/djfm\/starred{\/owner}{\/repo}",
                        "subscriptions_url": "https:\/\/api.github.com\/users\/djfm\/subscriptions",
                        "organizations_url": "https:\/\/api.github.com\/users\/djfm\/orgs",
                        "repos_url": "https:\/\/api.github.com\/users\/djfm\/repos",
                        "events_url": "https:\/\/api.github.com\/users\/djfm\/events{\/privacy}",
                        "received_events_url": "https:\/\/api.github.com\/users\/djfm\/received_events",
                        "type": "User",
                        "site_admin": false,
                        "name": "Fran\u00e7ois-Marie de Jouvencel",
                        "company": null,
                        "blog": null,
                        "location": "Paris",
                        "email": "fm.de.jouvencel@gmail.com",
                        "hireable": true,
                        "bio": null,
                        "public_repos": 147,
                        "public_gists": 19,
                        "followers": 24,
                        "following": 8,
                        "created_at": "2012-02-22T09:00:26Z",
                        "updated_at": "2016-12-25T17:27:52Z",
                        "contributions": 1018
                    },
                    {
                        "login": "jnadaud",
                        "id": 4747745,
                        "avatar_url": "https:\/\/avatars.githubusercontent.com\/u\/4747745?v=3",
                        "gravatar_id": "",
                        "url": "https:\/\/api.github.com\/users\/jnadaud",
                        "html_url": "https:\/\/github.com\/jnadaud",
                        "followers_url": "https:\/\/api.github.com\/users\/jnadaud\/followers",
                        "following_url": "https:\/\/api.github.com\/users\/jnadaud\/following{\/other_user}",
                        "gists_url": "https:\/\/api.github.com\/users\/jnadaud\/gists{\/gist_id}",
                        "starred_url": "https:\/\/api.github.com\/users\/jnadaud\/starred{\/owner}{\/repo}",
                        "subscriptions_url": "https:\/\/api.github.com\/users\/jnadaud\/subscriptions",
                        "organizations_url": "https:\/\/api.github.com\/users\/jnadaud\/orgs",
                        "repos_url": "https:\/\/api.github.com\/users\/jnadaud\/repos",
                        "events_url": "https:\/\/api.github.com\/users\/jnadaud\/events{\/privacy}",
                        "received_events_url": "https:\/\/api.github.com\/users\/jnadaud\/received_events",
                        "type": "User",
                        "site_admin": false,
                        "name": "J\u00e9r\u00f4me Nadaud",
                        "company": "SensioLabs",
                        "blog": "http:\/\/nadaud.org",
                        "location": null,
                        "email": "jerome.nadaud@gmail.com",
                        "hireable": true,
                        "bio": null,
                        "public_repos": 29,
                        "public_gists": 7,
                        "followers": 46,
                        "following": 5,
                        "created_at": "2013-06-20T10:42:03Z",
                        "updated_at": "2016-12-21T15:23:43Z",
                        "contributions": 980
                    },
                    {
                        "login": "bmancone",
                        "id": 2864622,
                        "avatar_url": "https:\/\/avatars.githubusercontent.com\/u\/2864622?v=3",
                        "gravatar_id": "",
                        "url": "https:\/\/api.github.com\/users\/bmancone",
                        "html_url": "https:\/\/github.com\/bmancone",
                        "followers_url": "https:\/\/api.github.com\/users\/bmancone\/followers",
                        "following_url": "https:\/\/api.github.com\/users\/bmancone\/following{\/other_user}",
                        "gists_url": "https:\/\/api.github.com\/users\/bmancone\/gists{\/gist_id}",
                        "starred_url": "https:\/\/api.github.com\/users\/bmancone\/starred{\/owner}{\/repo}",
                        "subscriptions_url": "https:\/\/api.github.com\/users\/bmancone\/subscriptions",
                        "organizations_url": "https:\/\/api.github.com\/users\/bmancone\/orgs",
                        "repos_url": "https:\/\/api.github.com\/users\/bmancone\/repos",
                        "events_url": "https:\/\/api.github.com\/users\/bmancone\/events{\/privacy}",
                        "received_events_url": "https:\/\/api.github.com\/users\/bmancone\/received_events",
                        "type": "User",
                        "site_admin": false,
                        "name": "Brice",
                        "company": null,
                        "blog": null,
                        "location": "Paris, France",
                        "email": null,
                        "hireable": null,
                        "bio": "@LeFigaro",
                        "public_repos": 4,
                        "public_gists": 0,
                        "followers": 14,
                        "following": 19,
                        "created_at": "2012-11-22T16:29:56Z",
                        "updated_at": "2016-12-01T12:51:48Z",
                        "contributions": 883
                    },
                ]
            }
        },
        computed: {
            counts: function () {
                let counts = [];
                this.topContributors.forEach((contributor) => {
                   counts.push(contributor.contributions);
                });

                return counts;
            },
            leftContributors: function() {
                let leftContributors = [];
                this.topContributors.forEach((contributor, index) => {
                    if (index % 2) {
                        return;
                    }
                    contributor.rank = index+1;
                    leftContributors.push(contributor);
                });

                return leftContributors;
            },
            rightContributors: function() {
                let rightContributors = [];
                this.topContributors.forEach((contributor, index) => {
                    if (index % 2) {
                        contributor.rank = index+1;
                        rightContributors.push(contributor);
                    }
                });

                return rightContributors;
            },
        },
        components:{
            'Experts':ExpertsComponent,
            'Enthusiasts': EnthusiastsComponent,
            'Beginners': BeginnersComponent,
            'arrow': ArrowComponent,
            'top-avatar': TopAvatarComponent
        }
    }
</script>
