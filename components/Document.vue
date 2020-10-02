<template>
    <nuxt-link class="document" :to="link">
        <img class="document-bg" v-if="doc.images && doc.images[0]" :src="'http://localhost:1337'+ doc.images[0].formats.medium.url"/>
        <div class="document-overlay" @mouseenter="hoverShow" @mouseleave="hoverHide">
            <div ref="docoverlay" class="document-gradient"
                :style="`background: linear-gradient(transparent,${doc.backgroundcolor});`"></div>
            <div class="document-bottom">
                <div ref="docyear" :style="'color:'+doc.foregroundcolor2" class="document-year">{{doc.date | formatDate}}</div>
                <div ref="doctitle" :style="'color:'+doc.foregroundcolor" class="document-title">{{doc.title}}</div>
                <div ref="doctags" :style="'color:'+doc.foregroundcolor2" class="document-tags">
                    <span v-for="tag in doc.tags" :key="tag.id">{{tag.name}}</span>
                </div>
            </div>
        </div>
        <svg v-bind:class="{selected:doc.selected, 'selectIndicator':true}">
          <path d="M 0 0 L 0 38 L 0 76 L 0 114 L 0 152"/>
        </svg>
    </nuxt-link>
</template>
<style>
    .document{
        color:white;
        width:100%;
        background-color:black;
        height:152px;
        text-decoration: none;
        box-sizing:border-box;
        position:relative;
        z-index:1;
        border-bottom: solid 1px rgba(255,255,255,0.25);
    }
    .document-bg{
        position:absolute;
        width:100%;
        height:100%;
        object-fit: cover;
        z-index: -1;
    }
    .document-overlay{
        overflow: hidden;
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
    }
    .document:visited{
        color:rgba(255,255,255,0.5);
    }
    .document-title{
        font-size:24px;
        font-weight: 600;
        opacity:0;
        transform:translateY(32px);
    }
    .document-tags, .document-year{
        opacity:0;
        font-size:0.8em;
    }
    .document-tags{
        margin-top:-4px;
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
    }
    .document .selectIndicator path{
        transition: 0.2s;
        d: path("M 1 0 L 1 38 L 1 76 L 1 114 L 1 152");
    }
    .document:hover .selectIndicator path{
        d: path("M 1 0 L 1 38 L 6 76 L 1 114 L 1 152");
    }
    .selectIndicator.selected path{
        d: path("M 1 0 L 1 38 L 24 76 L 1 114 L 1 152") !important;
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
            console.log("hover");
            this.hoverAnimation(".out").play();
        },
        hoverHide(){
            this.hoverAnimation(".in").reverse(0);
        }
    },
    mounted(){
        if(this.images){
            
        }
    }
}
</script>