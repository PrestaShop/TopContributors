(window.webpackJsonp=window.webpackJsonp||[]).push([[18,5,20,21,22,24,25],{291:function(t,r,o){"use strict";o.r(r);var n=new(o(29).default);r.default=n},292:function(t,r,o){"use strict";r.a={fabienvallon:{},MatShir:{},sowbiba:{},jolelievre:{},kpodemski:{},matks:{},"matthieu-rolland":{},eternoendless:{},PululuK:{},atomiix:{},NeOMakinG:{},Hlavtox:{},zuk3975:{},mparvazi:{},marsaldev:{},okom3pom:{},SharakPL:{},TristanLDD:{},florine2623:{},HanaRebaiQA:{},hibatallahAouadni:{},khouloudbelguith:{},marwachelly:{},AureRita:{},"Robin-Fischer-PS":{},sarahdib:{},nesrineabdmouleh:{},SD1982:{},boubkerbribri:{},Julievrz:{}}},294:function(t,r,o){"use strict";o.r(r);o(52);var n=o(291),e=o(295),l=o(296),c=o(297),h=o(292),d={name:"TopAvatar",components:{LinkIcon:l.default,GithubIcon:e.default,MegaphoneIcon:c.default},props:{contributor:{type:Object,default:function(){}}},data:function(){return{organizationMembersDatas:h.a}},computed:{contributorName:function(){var t=this.contributor.name?this.contributor.name:this.contributor.login;return t.length>=21?t.substr(0,21)+" (..)":t},contributorBlogLink:function(){return""!==this.contributor.blog&&this.contributor.blog},contributorGitHubLink:function(){return""!==this.contributor.html_url&&this.contributor.html_url}},methods:{showSelectedContributor:function(t){"A"!==t.target.tagName&&n.default.$emit("showSelectedContributor",{selectedContributor:this.contributor})}}},v=o(104),component=Object(v.a)(d,(function(){var t=this,r=t._self._c;return r("div",{staticClass:"contributor top-contributor",attrs:{id:t.contributor.login},on:{click:t.showSelectedContributor}},[r("div",{staticClass:"top-contributor-content"},[r("div",{staticClass:"avatar"},[r("img",{attrs:{src:t.contributor.avatar_url,loading:"lazy"}})]),t._v(" "),r("div",{staticClass:"details"},[r("div",{staticClass:"position"},[t._v("#"+t._s(t.contributor.rank))]),t._v(" "),r("div",{staticClass:"name"},[t._v(t._s(t.contributorName))]),t._v(" "),r("div",{staticClass:"info"},[r("a",{attrs:{href:t.contributorGitHubLink,target:"_blank"}},[t._v("\n          ("+t._s(t.contributor.login)+")\n        ")])]),t._v(" "),r("div",{staticClass:"links"},[t.contributorBlogLink?r("a",{attrs:{href:t.contributorBlogLink,target:"_blank"}},[r("link-icon")],1):t._e(),t._v(" "),t.contributorGitHubLink?r("a",{attrs:{href:t.contributorGitHubLink}},[r("github-icon")],1):t._e(),t._v(" "),t.organizationMembersDatas[t.contributor.login]?r("a",{attrs:{href:"https://www.prestashop-project.org/maintainers-guide/project-organization/",target:"_blank"}},[r("megaphone-icon")],1):t._e()])]),t._v(" "),t._m(0)])])}),[function(){var t=this,r=t._self._c;return r("div",{staticClass:"dots"},[r("div",{staticClass:"dot"}),t._v(" "),r("div",{staticClass:"dot"}),t._v(" "),r("div",{staticClass:"dot"})])}],!1,null,null,null);r.default=component.exports},295:function(t,r,o){"use strict";o.r(r);var n={props:{height:{type:String,default:"18"},width:{type:String,default:"18"},viewBox:{type:String,default:"0 0 16 16"}}},e=o(104),component=Object(e.a)(n,(function(){var t=this,r=t._self._c;return r("svg",{staticClass:"icon icon-github",attrs:{version:"1.1",height:t.height,viewBox:t.viewBox,width:t.width}},[r("path",{attrs:{fillRule:"evenodd",d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"}})])}),[],!1,null,null,null);r.default=component.exports},296:function(t,r,o){"use strict";o.r(r);var n={props:{height:{type:String,default:"24"},width:{type:String,default:"24"},viewBox:{type:String,default:"0 0 24 24"}}},e=o(104),component=Object(e.a)(n,(function(){var t=this,r=t._self._c;return r("svg",{staticClass:"icon icon-link",attrs:{fill:"#000000",height:t.height,viewBox:t.viewBox,width:t.width,transform:"rotate(-45)"}},[r("path",{attrs:{transform:"rotate(-45 12 12)",d:"M0 0h24v24H0z",fill:"none"}}),t._v(" "),r("path",{attrs:{transform:"rotate(-45 12 12)",d:"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"}})])}),[],!1,null,null,null);r.default=component.exports},297:function(t,r,o){"use strict";o.r(r);var n={props:{height:{type:String,default:"24"},width:{type:String,default:"24"},viewBox:{type:String,default:"0 0 24 24"}}},e=o(104),component=Object(e.a)(n,(function(){var t=this,r=t._self._c;return r("svg",{staticClass:"icon icon-megaphone",attrs:{fill:"#000000",height:t.height,viewBox:t.viewBox,width:t.width,transform:"rotate(-45)"}},[r("path",{attrs:{d:"M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49a68.14 68.14 0 0 0-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 74.663 74.663 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199V2.5zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0zm-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233c.18.01.359.022.537.036 2.568.189 5.093.744 7.463 1.993V3.85zm-9 6.215v-4.13a95.09 95.09 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A60.49 60.49 0 0 1 4 10.065zm-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68.019 68.019 0 0 0-1.722-.082z"}})])}),[],!1,null,null,null);r.default=component.exports},298:function(t,r,o){"use strict";o.r(r);var n=o(291),e={name:"Avatar",extends:o(294).default,props:{contributor:{type:Object,default:function(){}},category:{type:String,default:""}},computed:{renderClasses:function(){return"position ".concat(this.category)}},methods:{showSelectedContributor:function(t){"A"!==t.target.tagName&&n.default.$emit("showSelectedContributor",{selectedContributor:this.contributor})}}},l=o(104),component=Object(l.a)(e,(function(){var t=this,r=t._self._c;return r("div",{staticClass:"col-2 contributor simple-contributor",attrs:{id:t.contributor.login},on:{click:t.showSelectedContributor}},[r("div",{staticClass:"avatar"},[r("img",{attrs:{src:t.contributor.avatar_url,loading:"lazy"}})]),t._v(" "),r("div",{staticClass:"details"},[r("div",{staticClass:"fixed-height"},[r("div",{staticClass:"name"},[t._v(t._s(t.contributorName))]),t._v(" "),r("div",{staticClass:"username"},[r("a",{attrs:{href:t.contributorGitHubLink,title:t.contributor.login,target:"_blank"}},[r("github-icon",{attrs:{height:"12",width:"12","view-box":"0 0 16 16"}})],1),t._v(" "),t.contributorBlogLink?r("div",{staticClass:"links"},[t._v("\n          |\n          "),r("a",{attrs:{href:t.contributorBlogLink,target:"_blank"}},[r("link-icon",{attrs:{height:"12",width:"12","view-box":"0 0 24 24"}})],1)]):t._e(),t._v(" "),t.organizationMembersDatas[t.contributor.login]?r("div",{staticClass:"links"},[t._v("\n          |\n          "),r("a",{attrs:{href:"https://www.prestashop-project.org/maintainers-guide/project-organization/"}},[r("megaphone-icon",{attrs:{height:"12",width:"12","view-box":"0 0 16 16"}})],1)]):t._e()])]),t._v(" "),r("div",{staticClass:"info"},[t._v(t._s(t.contributor.contributions)+" contrib.")]),t._v(" "),r("div",{class:t.renderClasses},[t._v("#"+t._s(t.contributor.rank))])])])}),[],!1,null,null,null);r.default=component.exports}}]);