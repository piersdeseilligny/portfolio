(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{360:function(t,e,o){var content=o(375);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(113).default)("23b98fc8",content,!0,{sourceMap:!1})},372:function(t,e,o){var n=o(4),r=o(373);n({target:"Number",stat:!0,forced:Number.parseInt!=r},{parseInt:r})},373:function(t,e,o){var n=o(3),r=o(209).trim,l=o(210),c=n.parseInt,d=/^[+-]?0[Xx]/,f=8!==c(l+"08")||22!==c(l+"0x16");t.exports=f?function(t,e){var o=r(String(t));return c(o,e>>>0||(d.test(o)?16:10))}:c},374:function(t,e,o){"use strict";o(360)},375:function(t,e,o){var n=o(112)(!1);n.push([t.i,".story-container{position:relative}.story-nav{display:flex;align-items:stretch;padding:12px 24px;position:absolute;width:100%;max-width:200px;top:0;left:0;box-sizing:border-box}.obstruction .story-nav{transition:all .2s;transform:translateY(-12px);opacity:0}.story-nav-block{height:4px;margin:0 4px;width:100%;background-color:var(--fgcolor2);opacity:1;display:none;position:relative;box-shadow:0 0 12px var(--bgcolor)}.story-nav-block-progress{height:4px;position:absolute;background-color:var(--fgcolor);width:1%}.story-slide{width:100%;position:absolute;transition:opacity .4s;opacity:0}.visibleslide{opacity:1}",""]),t.exports=n},389:function(t,e,o){"use strict";o.r(e);o(208),o(53),o(34),o(54),o(372),o(35);var n=o(352);var r={props:["slides"],data:function(){return{timeline:void 0,pausetime:Number.NaN,focustimeout:void 0,activeslide:1}},methods:{loadSlide:function(t,e){e&&console.info("Failed to load previous image!! loading "+t+" instead");var o=this.$refs["slide"+t];o&&o[0]&&this.slides[t]?o[0].setAttribute("src",this.$staticAsset(this.$config.strapiBaseUri+this.slides[t].url)):console.info("Slide "+t+" doesn't exist!!")},showSlide:function(t){if(this.activeslide=t,document)for(var e=document.getElementsByClassName("story-slide"),i=0;i<e.length;i++){var element=e[i];element.getAttribute("data-slideindex")==t?element.classList.add("visibleslide"):element.classList.remove("visibleslide")}},clickDown:function(){var t=this;this.pausetime=(new Date).getTime(),this.timeline.pause(),this.focustimeout=setTimeout((function(){t.$emit("hideobstruction")}),400)},clickUp:function(){if(this.focustimeout&&(clearTimeout(this.focustimeout),this.focustimeout=void 0,this.$emit("showobstruction")),(new Date).getTime()-this.pausetime<400)if(function(t,e){var o=e.getBoundingClientRect();if(o){var n=(t.touches?t.touches[0].pageX:t.pageX)-o.left;return(n=n<0?0:n>o.width?o.width:n)/o.width}return 0}(event,this.$refs.container)<.5){var t=0,e=this.timeline.previousLabel();e&&e.replace&&(t=Number.parseInt(this.timeline.previousLabel().replace("slide_",""))),0!=t&&t--,null==t&&(t=this.timeline.previousLabel()),this.timeline.seek("slide_"+t),this.timeline.play()}else{var o=this.timeline.nextLabel();o?this.timeline.seek(o):this.timeline.seek(0),this.timeline.play()}else this.timeline.paused&&this.timeline.play()}},mounted:function(){var t=this,e=this.$refs.navBlocks.getElementsByClassName("story-nav-block-progress");this.timeline=n.a.timeline({defaults:{ease:"linear",duration:4},onComplete:function(){for(var i=0;i<e.length;i++)e[i].style.width="0";this.restart()}});for(var o=function(i){e[i].style.width="0",t.timeline.addLabel("slide_"+i),t.timeline.to(e[i],{width:"100%",onStart:function(){t.showSlide(i)}})},i=0;i<e.length;i++)o(i);this.timeline.play()},beforeDestroy:function(){this.timeline.kill()},fetch:function(){}},l=(o(374),o(61)),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{ref:"container",staticClass:"story-container"},[o("div",{ref:"slidecontainer",staticClass:"story-slidecontainer"},t._l(t.slides,(function(e,n){return o("img",{key:e.id,ref:"slide"+n,refInFor:!0,staticClass:"story-slide",attrs:{src:0==n?t.$staticAsset(t.$config.strapiBaseUri+e.url):void 0,"data-slideindex":n,alt:""},on:{load:function(e){return t.loadSlide(n+1)},error:function(e){return t.loadSlide(n+1,!0)}}})})),0),t._v(" "),o("nav",{ref:"navBlocks",staticClass:"story-nav"},t._l(t.slides,(function(t){return o("div",{key:t.id,staticClass:"story-nav-block"},[o("span",{staticClass:"story-nav-block-progress"})])})),0)])}),[],!1,null,null,null);e.default=component.exports}}]);