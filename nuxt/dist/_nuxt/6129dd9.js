(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{365:function(t,e,o){var content=o(380);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(113).default)("78bfe700",content,!0,{sourceMap:!1})},379:function(t,e,o){"use strict";o(365)},380:function(t,e,o){var r=o(112)(!1);r.push([t.i,".category-hero-container{--heroheight:112px;display:grid;grid-template-columns:repeat(3,1fr);grid-gap:2px;gap:2px;margin-top:12px;padding-right:var(--rightmargin);margin-right:-4px}.category-hero{background:var(--backgroundclick);text-decoration:none;color:#fff;height:var(--heroheight);position:relative;margin-right:4px;font-size:20px}.category-hero.viewall{font-size:14px;color:rgba(215,237,255,.5)}.category-hero .mask{background:#000;opacity:.9;position:absolute;left:1px;right:1px;top:1px;bottom:1px;transition:all .2s cubic-bezier(.165,.84,.44,1)}.category-hero.viewall .mask{opacity:.8}.category-hero img.thumbnail{filter:saturate(0);opacity:.4}.category-hero img.thumbnail,.category-hero video{position:absolute;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;transition:all .4s}.category-hero video{opacity:0}.category-hero:hover .mask{left:3px;right:3px;top:3px;bottom:3px;opacity:.7}.category-hero:hover video{opacity:.5}.category-hero:hover .thumbnail{opacity:0}.category-hero:hover .thumbnail.novideo{filter:saturate(1);opacity:.5}.category-hero span{line-height:var(--heroheight);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;text-align:center;width:100%;display:block;position:absolute}",""]),t.exports=r},392:function(t,e,o){"use strict";o.r(e);var r={props:["selected","categories"],methods:{}},n=(o(379),o(61)),component=Object(n.a)(r,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"category-hero-container"},[t._l(t.categories,(function(e){return o("nuxt-link",{directives:[{name:"tilt",rawName:"v-tilt"}],key:e.id,staticClass:"category-hero fx-hovershadow",attrs:{to:{path:"/work",hash:e.slug}}},[o("div",{staticClass:"mask"}),t._v(" "),e.thumbnailimage?o("img",{class:{thumbnail:!0,novideo:!e.thumbnailvideo},attrs:{alt:"",src:t.$staticAsset(t.$config.strapiBaseUri+e.thumbnailimage.formats.small.url)}}):t._e(),t._v(" "),e.thumbnailvideo?o("video",{ref:"vid",refInFor:!0,attrs:{alt:"",loop:"",muted:"",autoplay:"",src:t.$staticAsset(t.$config.strapiBaseUri+e.thumbnailvideo.url)},domProps:{muted:!0}}):t._e(),t._v(" "),o("span",[t._v(t._s(e.name))])])})),t._v(" "),o("nuxt-link",{directives:[{name:"tilt",rawName:"v-tilt"}],staticClass:"category-hero fx-hovershadow viewall",attrs:{to:"/work"}},[o("div",{staticClass:"mask"}),t._v(" "),o("span",[t._v("View All")])])],2)}),[],!1,null,null,null);e.default=component.exports}}]);