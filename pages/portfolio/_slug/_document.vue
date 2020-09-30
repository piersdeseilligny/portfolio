<template>
<div class="doccont-container" :style="`--bgcolor: ${document.backgroundcolor}; --fgcolor: ${document.foregroundcolor}; --fgcolor2: ${document.foregroundcolor2}`">
    <div v-if="document.images && document.images[0]" 
        ref="doccontImgContainer"
        class="doccont-imgcontainer" 
        :style="`padding-top:calc(${(document.images[0].formats.large.height/document.images[0].formats.large.width)*100}% - 64px);`">
        <img class="doccont-img" :src="`http://localhost:1337${document.images[0].formats.large.url}`"/>
        <div class="doccont-gradient"></div>
    </div>
    <div class="doccont-content">
        <div class="doccont-content-col1" ref="doccontContentCol1">
            <div v-if="document.poster" class="doccont-content-postercontainer"
                :style="`padding-top:calc(${(document.poster.formats.medium.height/document.poster.formats.medium.width)*100}%;`">
                <img class="doccont-content-poster" :src="`http://localhost:1337${document.poster.formats.medium.url}`"/>
            </div>
            <div class="moreinfo-container" v-if="document.moreinfo">
                <div class="moreinfo" v-for="info in document.moreinfo" :key="info.id">
                    <div class="moreinfo-header fgcolor2" v-if="info.header">{{info.header}}</div>
                    <div class="moreinfo-subheader fgcolor2" v-if="info.subheader">{{info.subheader}}</div>
                    <a v-if="info.link && info.outlink" :href="info.link"><div class="icon" v-if="info.outlink.svg" v-html="info.outlink.svg"/>{{info.outlink.name}}</a>
                </div>
            </div>
        </div>
        <div class="doccont-content-col2" >
            <h1 class="doccont-content-title fgcolor" ref="doccontContentTitle">{{document.title}}</h1>
            <div class="doccont-content-description fgcolor2">
                {{document.description}}
            </div>
            <div class="doccont-contentblocks">
                <ContentBlock v-for="block in document.contentblocks" :key="block.id" :block="block"/>
            </div>
        </div>
    </div>
</div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Pridi&display=swap');

.fgcolor{
    color:var(--fgcolor);
}
.fgcolor2{
    color:var(--fgcolor2);
}

.moreinfo-header{
    font-weight:700;
}
.moreinfo-subheader{
    margin-top:-2px;
    font-size:12px;
    opacity:0.6;
}
.moreinfo-container{
    margin-top:12px;
}
.moreinfo {
    font-size:13px;
    margin-top:6px;
}

.moreinfo a{
    color:var(--fgcolor2);
    font-weight: 600;
    text-decoration: none;
    font-size:14px;
}
.moreinfo a:hover{
    opacity:0.8;
}
.moreinfo a:active{
    opacity:0.6;
}
.moreinfo a .icon{
    vertical-align: sub;
    display: inline-block;
    margin-right:4px;
}
.moreinfo a .icon svg{
    max-height:20px;
}


.doccont-container{
    position: relative;
    width: 100%;
    background:var(--bgcolor);
    overflow-x:hidden;
    overflow-y:auto;
    transition: all 0.2s;
    color: var(--fgcolor);
}
.doccont-gradient{
    background: linear-gradient(0deg, var(--bgcolor), transparent);
    width:100%;
    height:64px;
    position:absolute;
    transition: all 0.2s;
}
.doccont-content{
    width:100%;
    padding:0px 48px;
    padding-bottom:64px;
    box-sizing: border-box;
    position:relative;
    display:flex;
}
.doccont-content-col1{
    flex-basis: 128px;
    margin-right:24px;
    margin-top:-24px;
    flex-shrink: 0;
}
.doccont-content-col2{
    max-width: 100%;
}

.doccont-content-postercontainer{
    /*Doesn't exist if there's no poster*/
    margin-right:24px;
    border: rgba(255, 255, 255, 0.1) solid 1px;
    width:100%;
    height:0;
    position:relative;
    box-shadow: 0 0 12px rgba(0,0,0,1);
}
.doccont-content-poster{
    object-fit: contain;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.doccont-imgcontainer{
    position: relative;
    width:100%;
    height:0;
}
.doccont-img{
    width:100%;
    max-width: 100%;
    object-fit: cover;
    position:absolute;
    top:0;
    left:0;
}

.doccont-content-description{
    font-size: 13px;
    margin-top:12px;
}
.fade-enter-active, .fade-leave-active {
   transition: opacity 2s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
   opacity: 0
}
</style>
<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
gsap.registerPlugin(ScrollTrigger);
function timelineFrom(el, done){
    var tl = gsap.timeline({
        onComplete:function(){
            done();
        },
        defaults:{
            ease:"power4.out"
        }
    });
    tl.from(el.querySelector(".doccont-imgcontainer"), { scale:0.9, opacity:0, duration: 0.3 }, 0);
    tl.from(el.querySelector(".doccont-content-title"), { y:-64, opacity:0, duration: 0.3 }, 0);
    tl.from(el.querySelector(".doccont-content-tags"), { y:-64, opacity:0, duration: 0.3 }, 0.05);
    tl.from(el.querySelector(".doccont-content-description"), { y:-64, opacity:0, duration: 0.3 }, 0.1);
    tl.from(el.querySelector(".doccont-content-col1"), { x:-32, opacity:0, duration: 0.3 }, 0);
    tl.play();
}
function timelineTo(el,done){
    var tl = gsap.timeline({
        onComplete:function(){
            done();
        },
        defaults:{
            ease:"power4.in"
        }
    });
    tl.to(el.querySelector(".doccont-imgcontainer"), { scale:1.1, opacity:0, duration: 0.3 }, 0);
    tl.to(el.querySelector(".doccont-content-title"), { y:64, opacity:0, duration: 0.3 }, 0);
    tl.to(el.querySelector(".doccont-content-tags"), { y:64, opacity:0, duration: 0.3 }, 0.05);
    tl.to(el.querySelector(".doccont-content-description"), { y:64, opacity:0, duration: 0.3 }, 0.1);
    tl.to(el.querySelector(".doccont-content-col1"), { x:32, opacity:0, duration: 0.3 }, 0);
}
export default {
    data(){
        return{
            document:{
                title:"hello",
                tags:[{name:"", id:""}]
            }
        }
    },
    transition:{
        leave(el, done){
            console.log("LEAVE ANIMATION");
            timelineTo(el, done);
        },
        enter(el, done){
            console.log("ENTER ANIMATION");
            timelineFrom(el, done);
        },
        mode:'out-in',
        css:false
    },
    mounted:function(){
        gsap.to(this.$refs.doccontImgContainer,{
            scrollTrigger:{
                trigger:"document",
                end:600,
                scrub:true,
            },
            yPercent:10
        });
        gsap.to(this.$refs.doccontContentTitle,{
            scrollTrigger:{
                trigger:"document",
                end:600,
                scrub:true,
            },
            y:-12
        });
        gsap.to(this.$refs.doccontContentCol1,{
            scrollTrigger:{
                trigger:"document",
                end:600,
                scrub:true,
            },
            y:-24
        });
    },
    async asyncData (context) {
      try{
          if(!context.params.document){
              return {document:{title:"select smth"}}
          }
          let q = `
          query {
            documents(where:{categories:{slug:"${context.params.slug}"}, slug:"${context.params.document}"}){
              title,
              description,
              contentblocks{
                tag{
                  name,
                  icon
                },
                beforeafters{
                  before{
                    formats
                  },
                  after{
                    formats
                  },
                  offset
                },
                description
              },
              moreinfo{
                link,
                outlink{
                  svg
                  tooltip,
                  name
                },
                header,
                subheader
              },
              date,
              id,
              slug,
              backgroundcolor,
              foregroundcolor,
              foregroundcolor2,
              images{
                  formats
              },
              poster{
                  formats
              },
              tags{
                  id,
                  name,
                  icon
              }
            }
          }
          `
        const data = await context.$strapi.graphql({
          query:q
        });
        if(data && data.documents && data.documents.length){
            return{ document:data.documents[0] }
        }
        else{
            //ERROR 404!
            return {document:{title:"404"}}
        }
      }
      catch(err){
          return{
              error:err
          }
      }
    }
}
</script>