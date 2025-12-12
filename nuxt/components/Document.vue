<template>
    <nuxt-link v-bind:class="{selected:doc.selected, 'document':true, 'fx-hovershadow':true}" :title="doc.tags.map(c=> c.name).join(', ')" :to="link" v-on:click.native="$emit('clickOnDoc', doc, $el);">
    <div class="document-container" :style="`background-color:${doc.backgroundcolor};z-index:0;`" v-tilt>
        <img ref="docbg" class="document-bg" alt="" @load="loadimg" v-if="doc.images && doc.images[0]" 
        :src="doc.secondaryCategory ? $staticAsset($config.strapiBaseUri+doc.images[1].formats.medium.url) : $staticAsset($config.strapiBaseUri+doc.images[0].formats.medium.url)"/>
        <div class="document-overlay" @touchstart="hoverShow" @touchend="hoverHide" @mouseenter="hoverShow" @mouseleave="hoverHide">
            <div ref="docoverlay" class="document-gradient"
                :style="`background: linear-gradient(transparent,${doc.backgroundcolor});`"></div>
            <div class="document-bottom">
                <div ref="docyear" :style="'color:'+doc.foregroundcolor2" class="document-year">{{doc.date | formatDate}}</div>
                <div ref="doctitle" :style="'color:'+doc.foregroundcolor" class="document-title">{{doc.title}}</div>
            </div>
        </div>
        <svg v-bind:class="{selected:doc.selected, 'selectIndicator':true}">
          <path d="M 0 0 L 0 38 L 0 76 L 0 114 L 0 152"/>
        </svg>
        </div>
    </nuxt-link>

</template>
<style>
    .document{
        color:white;
       /* width:276px;*/
        background-color:black;
        height:158px;
        text-decoration: none;
        box-sizing:border-box;
        position:relative;
        z-index:1;
        margin-right: 12px;
        margin-top:12px;
        transition: all 0.2s;
        scroll-margin: 24px;
        scroll-snap-margin: 24px;
    }
    .withinportfolio .document{
      width:287px;
      height:138px;
      margin-right:0px;
    }

@media screen and (max-width: 800px) {
  .document{
   /* width:213px !important;*/
    height: 101px !important;
  }
}
    .document .document-container::after{
      position:absolute;
      width:100%;
      height:100%;
      content:' ';
      box-sizing: border-box;
      border: solid 1px rgba(255,255,255,0.25);
      pointer-events: none;
      transition: border 0.3s;
    }
    .document:hover .document-container::after{
      border: solid 1px rgba(255,255,255,0.4);
    }
    .document:active .document-container::after{
      border: solid 1px rgba(255,255,255,0.6);
    }
    .document.selected .document-container::after{
      border: solid 1px rgba(255,255,255,1);
    }
    .document.selected{
      pointer-events:none;
      box-shadow: 0 0 24px black;
      z-index: 3;
    }

.document-container{
  position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow:hidden;
}

    .document-bg{
        position:absolute;
        width:100%;
        height:100%;
        object-fit: cover;
        z-index: -1;
        opacity:0;
    }
    .document.selected .document-bg{
      transform:translateX(1px);
    }
    .document-gradient{
        position:absolute;
        width:100%;
        height:100%;
        opacity: 0;
    }
    .document-bottom{
        position:absolute;
        margin-left:12px;
        bottom:8px;
        width:100%;
        transform: translateZ(40px);
    }

    .document:visited{
        color:rgba(255,255,255,0.5);
    }
    .document-title{
        font-size:24px;
        font-weight: 200;
        opacity:0;
        transform:translateY(32px);
        font-family:var(--font-secondary);
    }
    .document-tags, .document-year{
        opacity:0;
        font-size:0.8em;
    }
    .document-tags{
        margin-top:-4px;
    }
    .document-tags svg{
        width:16px;
        height:16px;
        fill:var(--foregroundcolor);
        margin-right:6px;
        margin-top:6px;
    }
    .document-year{
        margin-bottom:-4px;
        font-weight: 600;
    }
    .selectIndicator{
        position:absolute;
        fill:transparent;
        stroke: rgba(255,255,255,0.25);
        stroke-width:2px;
        top:0;
        left:318px;
        width:32px;
        height:100%;
        display:none;
    }
    .fullscreenlist .selectIndicator{
      display:none;
    }
    .fullscreenlist
    .document .selectIndicator path{
        transition: 0.2s;
        d: path("M 1 0 L 1 44 L 1 76 L 1 108 L 1 152");
    }
    .document:hover .selectIndicator path{
        d: path("M 1 0 L 1 44 L 6 76 L 1 108 L 1 152");
    }
    .selectIndicator.selected path{
        d: path("M 1 0 L 1 44 L 12 76 L 1 108 L 1 152") !important;
    }
    @media screen and (max-width:800px) {
        .selectIndicator{
            position:absolute;
            fill:transparent;
            stroke: rgba(255,255,255,0.25);
            stroke-width:2px;
            bottom:-2px;
            left:0;
            top:128px;
            width:320px;
            height:32px;
        }
        .document .selectIndicator path{
            transition: 0.2s;
            d: path("M 0 1 L 80 1 L 160 1 L 240 1 L 320 1");
        }
        .document:hover .selectIndicator path{
            d: path("M 0 1 L 80 1 L 160 6 L 240 1 L 320 1");
        }
        .selectIndicator.selected path{
            d: path("M 0 1 L 80 1 L 160 32 L 240 1 L 320 1") !important;
        }
        .document-title{
          font-size:20px;
        }
        .document-tags{
          display:none;
        }
    }
    @media (hover: none) {
      .document-title{
        opacity:1 !important;
        transform:translateY(0) !important;
      }
      .document-year{
        opacity:1 !important;
        transform:translateY(0) !important;
      }
      .document-tags{
        opacity:1 !important;
        transform:translateY(0) !important;
      }
      .document-gradient{
        opacity:1 !important;
      }
    }
</style>
<script>
import { gsap } from "gsap";
export default {
    props:["doc","link"],
    methods:{
        hoverAnimation(end){
            let tl = gsap.timeline({defaults:{ease:"power4"+end, duration:0.3}});
            tl.fromTo(this.$refs.docyear, {y:12, opacity:0}, {opacity:1, y:0},0);
            tl.fromTo(this.$refs.doctitle, {y:24, opacity:0}, {opacity:1, y:0},0);
            tl.fromTo(this.$refs.doctags, {y:32, opacity:0}, {opacity:1, y:0},0);
            tl.fromTo(this.$refs.docoverlay, {opacity:0}, {opacity:1},0);
            return tl;
        },
        hoverShow(){
            this.hoverAnimation(".out").play();
        },
        hoverHide(){
            this.hoverAnimation(".in").reverse(0);
        },
        loadimg(){
          gsap.to(this.$refs.docbg, {opacity:1, duration:0.3});
        }
    },
    mounted(){
        if(this.images){

        }
    }
}
</script>
