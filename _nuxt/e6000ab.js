(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{305:function(t,o,r){var content=r(321);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(115).default)("01ab0ef5",content,!0,{sourceMap:!1})},320:function(t,o,r){"use strict";r(305)},321:function(t,o,r){var n=r(114)((function(i){return i[1]}));n.push([t.i,".contributor-links{margin-top:30px}.contributor-links a{color:#25b9d7;display:block;font-size:14px;font-weight:600;letter-spacing:0;line-height:19px}",""]),n.locals={},t.exports=n},336:function(t,o,r){"use strict";r.r(o);var n={name:"ContributorRoles",props:{contributor:{type:Object,required:!0}},computed:{blogText(){let t=this.contributor.blog.replace(/^https?:\/\//,"");return t.length>22&&(t=`${t.substring(0,22)}...`),t}}},l=(r(320),r(104)),component=Object(l.a)(n,(function(){var t=this,o=t._self._c;return o("div",{staticClass:"contributor-links"},[t.contributor.html_url?o("a",{staticClass:"contributor-links-github",attrs:{href:t.contributor.html_url,target:"_blank"}},[t._v("\n    Github\n  ")]):t._e(),t._v(" "),""!==t.contributor.blog?o("a",{staticClass:"contributor-links-blog",attrs:{href:t.contributor.blog,target:"_blank"}},[t._v("\n    "+t._s(t.blogText)+"\n  ")]):t._e()])}),[],!1,null,null,null);o.default=component.exports}}]);