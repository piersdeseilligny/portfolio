<template>
  <div
    ref="container"
    class="doccont-container"
    :style="`--bgcolor: ${document.backgroundcolor}; --fgcolor: ${document.foregroundcolor}; --fgcolor2: ${document.foregroundcolor2}`"
  >
  <CoolLightBox
      :items="lightboxitems"
      :index="lightboxindex"
      @close="lightboxindex = null">
    </CoolLightBox>
      <CoolLightBox
      :items="lightboxitemsAlt"
      :index="lightboxindexAlt"
      @close="lightboxindexAlt = null">
    </CoolLightBox>

    <div
      v-if="document.images && document.images[0]"
      ref="doccontImgContainer"
      class="doccont-imgcontainer"
      :style="`z-index:0;position:absolute;width:100%;top:0;left:0;padding-top:calc(${
        (document.images[0].formats.medium.height /
          document.images[0].formats.medium.width) *
        100
      }% - 64px);`"
    >
      <div class="doccont-imgcontent" ref="doccontImgContent">
        <Story
          ref="doccontStory"
          :slides="document.images"
          :key="document.id"
        />
        <div class="doccont-gradient"></div>
        <div class="doccont-biggradient" ref="doccontImgGradient"></div>
      </div>
    </div>

    <div class="doccont-scroller" ref="doccontScroller">
      <div
        v-if="document.images && document.images[0]"
        @click="slidesClick"
        @mouseenter="slidesEnter"
        @mouseleave="slidesLeave"
        :style="`cursor:pointer;position: relative;width: 100%;height: 0;padding-top:calc(${
          (document.images[0].formats.medium.height /
            document.images[0].formats.medium.width) *
          100
        }% - 64px);`"
      ></div>
      <div class="doccont-content" ref="doccontContent">
        <div class="doccont-content-col1" ref="doccontContentCol1" v-if="document.poster && document.moreinfo">
          <div v-if="document.poster" :class="{'doccont-content-postercontainer-root':true, 'noshadow':document.nopostershadow}">
            <div
            class="doccont-content-postercontainer"
            :style="`padding-top:calc(${
              (document.poster.height /
                document.poster.width) *
              100
            }%;`"
          >
            <img
              class="doccont-content-poster"
              alt="Poster"
              :src="$staticAsset($config.strapiBaseUri + bestImageFromLarge(document.poster.formats).url)"
            />
            </div>
          </div>
          <div class="moreinfo-container" v-if="document.moreinfo">
            <div
              class="moreinfo"
              v-for="info in document.moreinfo"
              :key="info.id"
            >
              <div class="moreinfo-header fgcolor2" v-if="info.header">
                {{ info.header }}
              </div>
              <div class="moreinfo-subheader fgcolor2" v-if="info.subheader">
                {{ info.subheader }}
              </div>
              <a class="outlink" v-if="info.link && info.outlink" target="_blank" :href="info.link">
                <i class="icon" v-if="info.outlink.svg" v-html="info.outlink.svg"/>
                <span>{{ info.outlink.name }}</span>
              </a>
            </div>
          </div>
        </div>
        <div class="doccont-content-col2">
          <h1 class="doccont-content-title fgcolor" ref="doccontContentTitle">
            {{ document.title }}
          </h1>
          <div class="doccont-content-description fgcolor2">
            <div class="content-tags"><span v-for="tag in document.tags" :key="tag.id"><i v-html="tag.icon"></i>{{tag.name}}&nbsp;&nbsp;&nbsp;</span></div>
            <div v-html="document.description"></div>
          </div>
          <div class="doccont-contentblocks">
            <ContentBlock
              v-for="block in document.contentblocks"
              :key="block.id"
              @openimage="openlightboxalt"
              :block="block"
            />
          </div>
        </div>
      </div>
    </div>
        <div class="topbuttons">
      <nuxt-link class="topbutton" title="Close" :to="{ path:'/work/'+this.$route.params.slug }">
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 512 512"
          style="enable-background: new 0 0 512 512"
          xml:space="preserve"
        >
          <g>
            <path
              class="st0"
              d="M376.7,111.5L255.8,232.5L135.6,112.3c-4.7-4.7-12.3-4.7-17,0l-7.1,7.1c-4.7,4.7-4.7,12.3,0,17l120.2,120.2
		L111.5,376.7c-4.7,4.7-4.7,12.3,0,17l7.1,7.1c4.7,4.7,12.3,4.7,17,0l120.2-120.2l120.9,120.9c4.7,4.7,12.3,4.7,17,0l7.1-7.1
		c4.7-4.7,4.7-12.3,0-17L279.8,256.5l120.9-120.9c4.7-4.7,4.7-12.3,0-17l-7.1-7.1C389,106.9,381.4,106.9,376.7,111.5z"
            />
          </g>
        </svg>
      </nuxt-link>
    </div>
  </div>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Pridi&display=swap");

.fgcolor {
  color: var(--fgcolor);
}
.fgcolor2 {
  color: var(--fgcolor2);
}

.topbuttons{
  z-index:4;
  position: absolute;
  top:12px;
  right:12px;
  width:32px;
}
.topbuttons .topbutton{
  width:32px;
  height:32px;
  opacity:0.5;
  transition: all 0.3s;
  text-decoration: none;
}
.topbuttons .topbutton:hover{
  opacity:0.8;
}
.topbuttons .topbutton:active{
  opacity:1;
}
.topbuttons .topbutton svg {
  fill: white;
}

.moreinfo-header {
  font-weight: 700;
}
.moreinfo-subheader {
  margin-top: -2px;
  font-size: 12px;
  opacity: 0.6;
}
.moreinfo-container {
  margin-top: 12px;
}
.moreinfo-container:first-child{
  margin-top:96px;
}
.moreinfo {
  font-size: 13px;
  margin-top: 6px;
}

.moreinfo a {
  color: var(--fgcolor2);
  font-weight: 600;
  text-decoration: none;

}
.moreinfo a:hover {
  opacity: 0.8;
}
.moreinfo a:active {
  opacity: 0.6;
}
.outlink {
  display:flex;
}
.outlink .icon {
  margin-right: 4px;
  width:20px;
}
.outlink span{
  line-height: 16px;
  align-self: center;
  margin-top:-4px;
}
.outlink .icon svg {
  max-height: 20px;
  fill: currentColor;
}

.outlink .icon .imdb-logo{
    max-height: 40px;
    width: 42px;
}

.doccont-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--bgcolor);
  overflow: hidden;
  transition: all 0.2s;
  color: var(--fgcolor);
  border-left:solid 1px rgba(255, 255, 255, 0.4);
  box-sizing:border-box;
}
.doccont-gradient {
  background: linear-gradient(0deg, var(--bgcolor), transparent);
  width: 100%;
  height: 96px;
  position: absolute;
  bottom: 0;
  transition: all 0.2s;
}
.doccont-biggradient {
  background: linear-gradient(0deg, var(--bgcolor), transparent);
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0;
}

.doccont-scroller {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
}

.doccont-content {
  width: 100%;
  padding: 0px 48px;
  /*padding-bottom: 64px;*/
  position: relative;
  display: flex;
  box-sizing: border-box;
}



.doccont-content-col1 {
  flex-basis: 128px;
  margin-right: 24px;
  margin-top: -24px;
  flex-shrink: 0;
  height: min-content;
  display:flex;
  flex-direction: column;
}
.doccont-content-col2 {
  max-width: 720px;
  margin-bottom: 72px;
  z-index: 1;
  width: 100%;
}
.doccont-content-col2 a{
  color:currentColor;
  transition: all 0.2s;
}
.doccont-content-col2 a:hover{
  color:white;
}
.doccont-content-postercontainer-root {
  /*Doesn't exist if there's no poster*/
  margin-right: 24px;
  border: rgba(255, 255, 255, 0.1) solid 1px;
  width:100%;
  height: fit-content;
  position: relative;
  box-shadow: 0 0 12px rgba(0, 0, 0, 1);
}
.doccont-content-postercontainer-root.noshadow{
  border:solid 1px transparent;
  box-shadow:none;
}

.doccont-content-postercontainer {
  /*Doesn't exist if there's no poster*/
  position: relative;
}
.doccont-content-poster {
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.doccont-imgcontent {
  width: 100%;
  height: calc(100% + 64px);
  max-width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow:hidden;
}
.doccont-img {
  width: 100%;
  max-width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
}

.doccont-content-title {
  font-family: var(--font-secondary);
  font-weight: 200;
}

.doccont-content-description {
  font-size: 13px;
  margin-top: 0px;
  z-index: 1;
  text-align: justify;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.cool-lightbox__slide{
  opacity:1 !important;
}

@media screen and (max-width: 800px) {
    .doccont-content {
    padding: 0 24px;
  }
}

@media screen and (max-width: 600px) {
  .doccont-content {
    flex-direction: column;
  }
  .doccont-content-col1{
    flex-direction: row;
    /*flex-basis: 100%;*/
  }
    .doccont-content-col2{
    margin-top:12px;
  }
  .doccont-content-postercontainer-root{
    max-width: 128px;
  }
  .doccont-content-postercontainer{
    flex-basis:128px;
    width:128px;
  }
}
@media screen and (max-width: 400px) {
  .doccont-content {
    padding: 0 12px;
  }
}
</style>
<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
function timelineFrom(el, done) {
  var tl = gsap.timeline({
    onComplete: function () {
      done();
    },
    defaults: {
      ease: "power4.out",
    },
  });
  tl.from(
    el.querySelector(".doccont-content-title"),
    { y: -64, opacity: 0, duration: 0.3 },
    0
  );
    tl.from(
    el.querySelector(".doccont-contentblocks"),
    { y: -32, opacity: 0, duration: 0.3 },
    0.05
  );
  tl.from(
    el.querySelector(".content-tags"),
    { y: -48, opacity: 0, duration: 0.3 },
    0.05
  );
  tl.from(
    el.querySelector(".doccont-content-description"),
    { y: -48, opacity: 0, duration: 0.3 },
    0.1
  );
  tl.from(
    el.querySelector(".doccont-content-col1"),
    { x: -32, opacity: 0, duration: 0.3 },
    0
  );
  tl.play();
}
function timelineTo(el, done) {
  var tl = gsap.timeline({
    onComplete: function () {
      done();
    },
    defaults: {
      ease: "power4.in",
    },
  });
  tl.to(
    el.querySelector(".doccont-imgcontainer"),
    { scale: 1.1, opacity: 0, duration: 0.3 },
    0
  );
  tl.to(
    el.querySelector(".doccont-content-title"),
    { y: 32, opacity: 0, duration: 0.3 },
    0
  );
  tl.to(
    el.querySelector(".content-tags"),
    { y: 48, opacity: 0, duration: 0.3 },
    0
  );
  tl.to(
    el.querySelector(".doccont-contentblocks"),
    { y: 64, opacity: 0, duration: 0.4 },
    0
  );
  tl.to(
    el.querySelector(".doccont-content-description"),
    { y: 48, opacity: 0, duration: 0.3 },
    0
  );
  tl.to(
    el.querySelector(".doccont-content-col1"),
    { x: 32, opacity: 0, duration: 0.3 },
    0
  );
}
export default {
  data() {
    return {
      document: {
        title: "hello",
        tags: [{ name: "", id: "" }],
        description:"",
      },
      lightboxindex:null,
      lightboxitems:[],
      lightboxindexAlt:null,
      lightboxitemsAlt:[]
    };
  },
  methods: {
    doccontImgLoaded: function () {
      gsap.to(this.$refs.doccontImg, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power4.out",
      });
    },
    slidesClick:function(){
      this.lightboxindex = this.$refs.doccontStory.activeslide;
    },
    slidesEnter:function(){
      gsap.to(this.$refs.doccontImgContent, {
        scale: 1.025,
        ease: "power.out",
        duration:0.15
      }).play();
    },
    slidesLeave:function(){
      gsap.to(this.$refs.doccontImgContent, {
        scale: 1,
        ease: "power.inout",
        duration:0.3
      }).play();
    },
    openlightboxalt: function(i){
      this.lightboxindexAlt = i;
    },
    bestImageFromLarge:function(formats){
      if(!formats) return {url:""};
      if(formats.large) return formats.large;
      else if(formats.medium) return formats.medium;
      else if(formats.small) return formats.small;
      else return {url:""};
    }
  },
  transition: {
    leave(el, done) {
      timelineTo(el, done);
    },
    enter(el, done) {
      timelineFrom(el, done);
    },
    mode: "out-in",
    css: false,
  },
  mounted: function () {
    ScrollTrigger.create({
      scroller: this.$refs.doccontScroller,
      trigger: this.$refs.doccontImgContent,
      start: 0,
      scrub: true,
      animation: gsap.to(this.$refs.doccontImgContent, {
        opacity: 0.5,
        ease: "power.out",
        yPercent: -25,
      }),
    });

    gsap.to(this.$refs.doccontImgGradient, {
      scrollTrigger: {
        scroller: this.$refs.doccontScroller,
        trigger: this.$refs.doccontImgContent,
        start: 0,
        scrub: true,
      },
      opacity: 1,
    });

  if(this.$refs.doccontContentCol1){
    gsap.to(this.$refs.doccontContentCol1, {
      scrollTrigger: {
        scroller: this.$refs.doccontScroller,
        trigger: this.$refs.doccontContentCol1,
        endTrigger: this.$refs.doccontContent,
        start: "top-=64",
        markers: false,
        pin: true,
        pinSpacing: false,
        pinReparent:true,
        scrub: true,
      },
    });
  }
  },
  head() {
    if(this.document && this.document.title){
      let image = undefined;
      let type = "website";
      if(this.document.poster){
        image = this.$staticAsset(this.$config.strapiBaseUri + this.bestImageFromLarge(this.document.poster.formats).url, true);
      }
      if(this.$route.params.slug == "software" && this.document.images && this.document.images[0] && this.document.images[0].formats.medium.url){
        image = this.$staticAsset(this.$config.strapiBaseUri + this.document.images[0].formats.medium.url, true);
      }
      if(this.document.typeoverride) type = this.document.typeoverride
      else{
        switch (this.$route.params.slug) {
          case 'film': type = "video.movie"; break;
          case 'software': type = "softwareapplication";
          default: type = 'website'
            break;
        }
      }
      return {
        title: this.document.title + " - Piers Deseilligny",
        description:this.document.description,
        meta:[
          { hid:'og-title', property:'og:title', content:this.document.title},
          { hid:'description', name:'description', content:this.document.description},
          { hid:'og-description', property:'og:description', content:this.document.description},
          { hid:'og-image', property:'og:image', content: "https://piersdeseilligny.com" + image },
          { hid:'og-type', property:'og:type', content:type},
          { hid:'og-url', property:'og:url', content:"https://piersdeseilligny.com/work/"+this.$route.params.slug+"/"+this.$route.params.document }
        ]
      }
    }
    else return null;
  },
  async asyncData(context) {
    try {
      if (!context.params.document) {
        return { document: { title: "" } };
      }
      let q = `
		  query {
			documents(where:{categories:{slug:"${context.params.slug}"}, slug:"${context.params.document}"}){
        title,
        typeoverride,
        nopostershadow,
			  description,
			  contentblocks{
				tag{
				  name,
				  icon
        },
        title,
        stills{
          formats,
          url,
          caption,
          name
        },
        squarestills,
        videoembed,
        videoembedaspect,
				beforeafters{
				  before{
          formats
          url
				  },
				  after{
          formats
          url
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
				  formats,
				  url
			  },
			  poster{
          formats,
          width,
          height
			  },
			  tags{
				  id,
				  name,
				  icon
			  }
			}
		  }
      `;
      let name = "work";
      if(context.params.slug) name+="_"+context.params.slug;
      if(context.params.document) name+="_"+context.params.document;
      const data = await context.$staticAPI({
        query: q,
      });
      if (data && data.documents && data.documents.length) {
        let images = [];
        if(data.documents[0].images){
          for(let img of data.documents[0].images){
            images.push({
              src:context.$staticAsset(context.$config.strapiBaseUri + img.url),
              description:img.caption,
              thumb:context.$staticAsset(context.$config.strapiBaseUri + img.formats.thumbnail.url)
            });
          }
        }
        let imagesAlt = [];
        if(data.documents[0].contentblocks){
          for(let block of data.documents[0].contentblocks){
            if(block.description){
              block.description = context.$md.render(block.description);
            }
            if(block.stills){
              for(let i in block.stills){
                block.stills[i].index = imagesAlt.length;
                block.stills[i].childshadow = (block.stills[i].name && block.stills[i].name.endsWith('_ns.PNG'));
                imagesAlt.push({
                  src:context.$staticAsset(context.$config.strapiBaseUri + block.stills[i].url),
                  description:block.stills[i].caption,
                  thumb:context.$staticAsset(context.$config.strapiBaseUri + block.stills[i].formats.thumbnail.url)
                });
              }
            }
          }
        }

        if(data.documents[0].description){
          data.documents[0].description = context.$md.render(data.documents[0].description);
        }
        return { document: data.documents[0], lightboxitems:images, lightboxitemsAlt:imagesAlt };
      } else {
        //ERROR 404!
        return { document: { title: "404" } };
      }
    } catch (err) {
      return {
        error: err,
      };
    }
  },
};
</script>
