(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{358:function(t,n,o){var content=o(370);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(113).default)("47501560",content,!0,{sourceMap:!1})},369:function(t,n,o){"use strict";o(358)},370:function(t,n,o){var e=o(112)(!1);e.push([t.i,".docnp-container{padding:0 12px 0 0;background:hsla(0,0%,100%,0);margin-top:12px;width:276px;height:138px;display:flex}@media screen and (max-width:800px){.docnp-container{width:213px!important;height:101px!important}}.docnp-poster{height:64px;width:40px;margin-right:6px;background-color:hsla(0,0%,100%,.1);opacity:1}.docnp-poster img{height:100%;width:100%;opacity:.5}.docnp-title{display:block}.docnp-year{opacity:.6}.docnp-moreinfo{display:inline-block}.docnp-mi{font-size:.7em;color:var(--foreground)}",""]),t.exports=e},383:function(t,n,o){"use strict";o.r(n);var e={props:["doc"]},c=(o(369),o(61)),component=Object(c.a)(e,(function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"docnp-container"},[o("div",{staticClass:"docnp-poster"},[o("img",{attrs:{alt:"Poster",src:t.$staticAsset(t.$config.strapiBaseUri+t.doc.poster.formats.thumbnail.url)}})]),t._v(" "),o("div",{staticClass:"docnp-details"},[o("a",{staticClass:"docnp-title fancy",attrs:{target:"_blank",href:t.doc.np_link}},[t._v("\n    "+t._s(t.doc.title)+"\n    "),o("span",{staticClass:"docnp-year"},[t._v("("+t._s(t._f("formatYear")(t.doc.date))+")")])]),t._v(" "),o("div",{staticClass:"docnp-moreinfo"},t._l(t.doc.moreinfo,(function(n){return o("div",{key:n.id,staticClass:"docnp-mi"},[n.header?o("span",{staticClass:"docnp-mi-header"},[t._v("\n        "+t._s(n.header)+"\n      ")]):t._e(),t._v(" "),n.subheader?o("a",{staticClass:"fancy fancysubtle",attrs:{target:"_blank",href:n.link}},[t._v("\n        "+t._s(n.subheader)+"\n      ")]):t._e()])})),0)])])}),[],!1,null,null,null);n.default=component.exports}}]);