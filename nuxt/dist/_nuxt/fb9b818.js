(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{361:function(e,t,n){var content=n(371);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(113).default)("2b31cfb4",content,!0,{sourceMap:!1})},370:function(e,t,n){"use strict";n(361)},371:function(e,t,n){var o=n(112)(!1);o.push([e.i,".tag{display:inline-block;color:var(--foregroundsubtle);-ms-user-select:none;user-select:none;-moz-user-select:none;-webkit-user-select:none;cursor:pointer;padding:0 8px;font-size:.7em;transition:background-color .2s,color .1s;white-space:normal;position:relative}.tag-icon{margin-right:2px}.contentblock .tag-icon{margin-right:6px}.tag-icon svg{max-width:14px;max-height:14px}.contentblock .tag-icon{max-height:18px}.contentblock .tag-icon svg{max-height:18px;max-width:24px}.tag:hover{color:var(--foreground)}.tag.selected{color:var(--foregroundlink)}.tags-selectedall .tag{color:#8b0000}",""]),e.exports=o},388:function(e,t,n){"use strict";n.r(t);n(29);var o={props:["id","name","icon","selected","category"],methods:{toggleselect:function(e){this.$emit("selectionchange",this.category,this.name,e)}}},c=(n(370),n(61)),component=Object(c.a)(o,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:{selected:e.selected,tag:!0},on:{click:[function(t){return t.ctrlKey||t.shiftKey||t.altKey||t.metaKey?null:e.toggleselect(!1)},function(t){return t.metaKey?e.toggleselect(!0):null},function(t){return t.ctrlKey?e.toggleselect(!0):null}]}},[e.icon?n("span",{staticClass:"tag-icon",domProps:{innerHTML:e._s(e.icon)}}):e._e(),e._v("\n    "+e._s(e.name)+"\n")])}),[],!1,null,null,null);t.default=component.exports}}]);