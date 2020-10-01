<template>
    <nuxt-link class="document" :to="link">
        <img class="document-bg" v-if="images && images[0]" :src="'http://localhost:1337'+ images[0].formats.medium.url"/>
        <div class="document-overlay">
            <div class="document-gradient"
                :style="`background: linear-gradient(transparent,${backgroundcolor});`"></div>
            <div class="document-bottom">
                <div class="document-year">{{date | formatDate}}</div>
                <div class="document-title">{{title}}</div>
                <div class="document-tags">
                    <span v-for="tag in tags" :key="tag.id">{{tag.name}}</span>
                </div>
            </div>
        </div>
        <svg v-bind:class="{selected:selected, 'selectIndicator':true}">
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
    .document-overlay{
        opacity:0;
    }
    .document-overlay:hover{
        opacity:1;
    }
    .document-bg{
        position:absolute;
        width:100%;
        height:100%;
        object-fit: cover;
        z-index: -1;
    }
    .document-gradient{
        position:absolute;
        width:100%;
        height:100%;
        
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
        opacity:0.8;
    }
    .document-tags, .document-year{
        opacity:0.6;
        font-size:0.8em;
    }
    .document-tags{
        margin-top:-4px;
    }
    .document-year{
        margin-bottom:-4px;
        font-weight: 600;
        opacity:0.4;
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
export default {
    props:["title","date","tags","link","selected", "images", "backgroundcolor"],
    mounted(){
        if(this.images){
            
        }
    }
}
</script>