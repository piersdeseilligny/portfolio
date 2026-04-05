<template>
  <div v-if="$fetchState.pending" class="doccont-loading">
    <!-- <div class="spinner"></div> -->
  </div>
  <div v-else ref="container" class="doccont-container"
    :style="`--bgcolor: ${document.backgroundcolor || 'black'}; --fgcolor: ${document.foregroundcolor || 'white'}; --fgcolor2: ${document.foregroundcolor2 || 'gray'}`">
    <CoolLightBox :items="lightboxitems" :index="lightboxindex" @close="lightboxindex = null">
    </CoolLightBox>
    <CoolLightBox :items="lightboxitemsAlt" :index="lightboxindexAlt" @close="lightboxindexAlt = null">
    </CoolLightBox>

    <div v-if="document.images && document.images[0] && document.images[0].formats && document.images[0].formats.medium"
      ref="doccontImgContainer" class="doccont-imgcontainer" :style="`z-index:0;position:absolute;width:100%;top:0;left:0;padding-top:calc(${(document.images[0].formats.medium.height /
        document.images[0].formats.medium.width) *
        100
        }% - 64px);`">
      <div class="doccont-imgcontent" ref="doccontImgContent">
        <Story ref="doccontStory" :slides="document.images" :key="document.id" />
        <div class="doccont-gradient"></div>
        <div class="doccont-biggradient" ref="doccontImgGradient"></div>
      </div>
    </div>

    <div class="doccont-scroller" ref="doccontScroller">
      <div
        v-if="document.images && document.images[0] && document.images[0].formats && document.images[0].formats.medium"
        @click="slidesClick" @mouseenter="slidesEnter" @mouseleave="slidesLeave" :style="`cursor:pointer;position: relative;width: 100%;height: 0;padding-top:calc(${(document.images[0].formats.medium.height /
          document.images[0].formats.medium.width) *
          100
          }% - 64px);`"></div>
      <div class="doccont-content" ref="doccontContent">
        <div class="doccont-content-col1" ref="doccontContentCol1" v-if="document.poster && document.moreinfo">
          <div v-if="document.poster"
            :class="{ 'doccont-content-postercontainer-root': true, 'noshadow': document.nopostershadow }">
            <div class="doccont-content-postercontainer" :style="`padding-top:calc(${(document.poster.height /
              document.poster.width) *
              100
              }%);`">
              <img class="doccont-content-poster" alt="Poster"
                :src="$staticAsset($config.strapiBaseUri + bestImageFromLarge(document.poster).url)" />
            </div>
          </div>
          <div class="moreinfo-container" v-if="document.moreinfo">
            <div class="moreinfo" v-for="info in document.moreinfo" :key="info.id">
              <div class="moreinfo-header fgcolor2" v-if="info.header">
                {{ info.header }}
              </div>
              <div class="moreinfo-subheader fgcolor2" v-if="info.subheader">
                <a v-if="info.link" :href="info.link">{{ info.subheader }}</a>
                <span v-else>{{ info.subheader }}</span>
              </div>
              <a class="outlink" v-if="info.link && info.outlink" target="_blank" :href="info.link" rel="noopener">
                <i class="icon" v-if="info.outlink.svg" v-html="info.outlink.svg" />
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
            <div class="content-tags"><span v-for="tag in document.tags" :key="tag.id"><i v-html="tag.icon"></i>{{
              tag.name }}&nbsp;&nbsp;&nbsp;</span></div>
            <div class="doccont-content-descriptiontext" v-html="document.description"></div>
          </div>
          <div class="doccont-contentblocks">
            <ContentBlock v-for="block in document.contentblocks" :key="block.id" @openimage="openlightboxalt"
              :block="block" />
          </div>
        </div>
      </div>
    </div>
    <div class="topbuttons">
      <a class="topbutton" title="Close" href="#" @click.prevent="$emit('close')">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px" y="0px" viewBox="0 0 512 512" style="enable-background: new 0 0 512 512" xml:space="preserve">
          <g>
            <path class="st0" d="M376.7,111.5L255.8,232.5L135.6,112.3c-4.7-4.7-12.3-4.7-17,0l-7.1,7.1c-4.7,4.7-4.7,12.3,0,17l120.2,120.2
		L111.5,376.7c-4.7,4.7-4.7,12.3,0,17l7.1,7.1c4.7,4.7,12.3,4.7,17,0l120.2-120.2l120.9,120.9c4.7,4.7,12.3,4.7,17,0l7.1-7.1
		c4.7-4.7,4.7-12.3,0-17L279.8,256.5l120.9-120.9c4.7-4.7,4.7-12.3,0-17l-7.1-7.1C389,106.9,381.4,106.9,376.7,111.5z" />
          </g>
        </svg>
      </a>
    </div>
  </div>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Pridi&display=swap");

.doccont-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fgcolor {
  color: var(--fgcolor);
}

.fgcolor2 {
  color: var(--fgcolor2);
}

.topbuttons {
  z-index: 4;
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
}

.topbuttons .topbutton {
  width: 32px;
  height: 32px;
  opacity: 0.5;
  transition: all 0.3s;
  text-decoration: none;
}

.topbuttons .topbutton:hover {
  opacity: 0.8;
}

.topbuttons .topbutton:active {
  opacity: 1;
}

.topbuttons .topbutton svg {
  fill: white;
  filter: drop-shadow(0px 0px 12px black);
}

.moreinfo-header {
  font-weight: 700;
  margin-bottom: 4px;
}

.moreinfo-subheader span {
  opacity: 0.6;
}

.moreinfo a {
  color: var(--fgcolor2);
  font-weight: 500;
  text-decoration: none;
  opacity: 0.8;
}

.moreinfo a:hover {
  opacity: 1;
}

.moreinfo a:active {
  opacity: 0.6;
}

.moreinfo-container {
  margin-top: 6px;
  margin-left: 2px;
}

.moreinfo-container:first-child {
  margin-top: 96px;
}

.moreinfo {
  font-size: 0.8rem;
  line-height: 0.8rem;
  margin-top: 14px;
}

.outlink {
  display: flex;
}

.outlink .icon {
  margin-right: 4px;
}

.outlink span {
  line-height: 16px;
  align-self: center;
  margin-top: -4px;
}

.outlink .icon svg {
  max-height: 20px;
  fill: currentColor;
}

.outlink .icon .imdb-logo {
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
  box-sizing: border-box;
  border-radius: 6px;
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
  background: url("/noisetexture.png");
  background-attachment: fixed;
}

.doccont-content {
  width: 100%;
  padding: 0 48px;
  /*padding-bottom: 64px;*/
  position: relative;
  display: flex;
  box-sizing: border-box;
}

.doccont-content-col1 {
  flex-basis: 128px;
  width: 128px;
  margin-right: 24px;
  margin-top: -48px;
  padding-top: 24px;
  flex-shrink: 0;
  align-self: flex-start;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
}

.doccont-content-col2 {
  /*max-width: 720px;*/
  margin-bottom: 72px;
  z-index: 1;
  width: 100%;
}

.doccont-content-col2 a {
  color: currentColor;
  transition: all 0.2s;
}

.doccont-content-col2 a:hover {
  color: white;
}

.doccont-content-postercontainer-root {
  /*Doesn't exist if there's no poster*/
  margin-right: 24px;
  border: rgba(255, 255, 255, 0.1) solid 1px;
  width: 100%;
  height: fit-content;
  position: relative;
  box-shadow: 0 0 12px rgba(0, 0, 0, 1);
}

.doccont-content-postercontainer-root.noshadow {
  border: solid 1px transparent;
  box-shadow: none;
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
  overflow: hidden;
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
  font-weight: 500;
}

.doccont-content-description {
  margin-top: 0px;
  z-index: 1;
  text-align: justify;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.cool-lightbox__slide {
  opacity: 1 !important;
}

@media screen and (max-width: 1200px) {
  .doccont-content {
    padding: 0 24px;
  }
}

@media screen and (max-width: 600px) {
  .doccont-content {
    flex-direction: column;
    padding: 0 12px;
  }

  /* When the sidebar exists, rearrange with CSS Grid.
     display:contents dissolves col1/col2/description wrappers
     so their children participate directly in the grid. */
  .doccont-content:has(> .doccont-content-col1) {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 12px;
  }

  .doccont-content:has(> .doccont-content-col1)>.doccont-content-col1,
  .doccont-content:has(> .doccont-content-col1)>.doccont-content-col2,
  .doccont-content:has(> .doccont-content-col1) .doccont-content-description {
    display: contents;
  }

  /* Poster: column 1, spanning title + tags + moreinfo rows */
  .doccont-content:has(> .doccont-content-col1) .doccont-content-postercontainer-root {
    grid-column: 1;
    grid-row: 1 / 4;
    max-width: 128px;
    width: 128px;
    margin-right: 0;
    align-self: start;
  }

  /* Title: beside poster */
  .doccont-content:has(> .doccont-content-col1) .doccont-content-title {
    grid-column: 2;
    grid-row: 1;
    align-self: end;
    margin: 0;
  }

  /* Tags: below title, beside poster */
  .doccont-content:has(> .doccont-content-col1) .content-tags {
    grid-column: 2;
    grid-row: 2;
    align-self: start;
  }

  /* Moreinfo: column 2, below tags, alongside poster — laid out horizontally */
  .doccont-content:has(> .doccont-content-col1) .moreinfo-container {
    grid-column: 2;
    grid-row: 3;
    display: flex;
    flex-wrap: wrap;
    gap: 2px 12px;
    overflow-x: auto;
    margin-top: 2px;
    padding-bottom: 4px;
    align-content: flex-start;
  }

  .doccont-content:has(> .doccont-content-col1) .moreinfo-container .moreinfo {
    flex-shrink: 0;
    margin-top: 6px;
  }

  /* Icon outlinks (order 1) → forced line-break (order 2) → text-only items (order 3) */
  .doccont-content:has(> .doccont-content-col1) .moreinfo-container .moreinfo:has(.icon) {
    order: 1;
  }

  .doccont-content:has(> .doccont-content-col1) .moreinfo-container .moreinfo:not(:has(.icon)) {
    order: 3;
  }

  /* Full-width invisible flex child forces a row break after the last icon */
  .doccont-content:has(> .doccont-content-col1) .moreinfo-container::after {
    content: '';
    flex-basis: 100%;
    height: 0;
    order: 2;
  }

  /* Description text + content blocks: full width below the poster+info block */
  .doccont-content:has(> .doccont-content-col1) .doccont-content-descriptiontext {
    grid-column: 1 / -1;
    grid-row: 5;
    margin-top: 12px;
  }

  .doccont-content:has(> .doccont-content-col1) .doccont-contentblocks {
    grid-column: 1 / -1;
    grid-row: 6;
  }

  /* Fallback: when no sidebar, col2 just flows normally */
  .doccont-content-col2 {
    margin-top: 12px;
  }
}
</style>
<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default {
  props: {
    categorySlug: String,
    documentSlug: String,
    prefetchedDocument: Object,
    prefetchedLightbox: Array,
    prefetchedLightboxAlt: Array
  },
  data() {
    return {
      document: {
        title: "",
        tags: [],
        description: "",
      },
      lightboxindex: null,
      lightboxitems: [],
      lightboxindexAlt: null,
      lightboxitemsAlt: []
    };
  },
  watch: {
    '$fetchState.pending': function (newVal) {
      if (!newVal && !this.$fetchState.error) {
        this.$nextTick(() => {
          this.initScrollHooks();
        });
      }
    },
    // Keep watching the prop just in case it changes dynamically
    documentSlug(newVal, oldVal) {
      if (newVal !== oldVal && !this.prefetchedDocument) {
        this.$fetch();
      }
    },
    prefetchedDocument: {
      handler(newVal) {
        if (newVal) {
          this.document = newVal;
          this.lightboxitems = this.prefetchedLightbox || [];
          this.lightboxitemsAlt = this.prefetchedLightboxAlt || [];
        }
      },
      immediate: true
    }
  },
  async fetch() {
    if (this.prefetchedDocument && this.prefetchedDocument.slug) {
      this.document = this.prefetchedDocument;
      this.lightboxitems = this.prefetchedLightbox || [];
      this.lightboxitemsAlt = this.prefetchedLightboxAlt || [];
      return;
    }

    if (!this.documentSlug) {
      this.document = { title: "" };
      return;
    }

    let q = `
		  query {
			documents(where:{categories:{slug:"${this.categorySlug}"}, slug:"${this.documentSlug}"}){
        title,
        typeoverride,
        nopostershadow,
			  description,
        shortdescription,
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
          height,
          url
			  },
			  tags{
				  id,
				  name,
				  icon
			  }
			}
		  }
      `;

    let apiContext = this.$nuxt ? this.$nuxt.context : this;
    const data = await this.$staticAPI({ query: q });

    if (data && data.documents && data.documents.length) {
      let images = [];
      if (data.documents[0].images) {
        for (let img of data.documents[0].images) {
          images.push({
            src: this.$staticAsset(this.$config.strapiBaseUri + img.url),
            description: img.caption,
            thumb: this.$staticAsset(this.$config.strapiBaseUri + img.formats.thumbnail.url)
          });
        }
      }
      let imagesAlt = [];
      if (data.documents[0].contentblocks) {
        for (let block of data.documents[0].contentblocks) {
          if (block.description) {
            block.description = this.$md.render(block.description);
          }
          if (block.stills) {
            for (let i in block.stills) {
              block.stills[i].index = imagesAlt.length;
              block.stills[i].childshadow = (block.stills[i].name && block.stills[i].name.endsWith('_ns.PNG'));
              imagesAlt.push({
                src: this.$staticAsset(this.$config.strapiBaseUri + block.stills[i].url),
                description: block.stills[i].caption,
                thumb: this.$staticAsset(this.$config.strapiBaseUri + block.stills[i].formats.thumbnail.url)
              });
            }
          }
        }
      }

      if (data.documents[0].description) {
        data.documents[0].description = this.$md.render(data.documents[0].description);
      }

      this.document = data.documents[0];
      this.lightboxitems = images;
      this.lightboxitemsAlt = imagesAlt;
    } else {
      if (this.$nuxt) this.$nuxt.error({ message: "Page not found", statusCode: 404 });
    }
  },
  methods: {
    initScrollHooks() {
      if (!this.$refs.doccontScroller || !this.$refs.doccontImgContent) return;

      ScrollTrigger.create({
        scroller: this.$refs.doccontScroller,
        trigger: this.$refs.doccontImgContent,
        start: 0,
        scrub: true,
        animation: gsap.to(this.$refs.doccontImgContent, {
          opacity: 0.5,
          ease: "power.out",
          yPercent: -10,
          filter: 'blur(10px)'
        }),
      });

      if (this.$refs.doccontImgGradient) {
        gsap.to(this.$refs.doccontImgGradient, {
          scrollTrigger: {
            scroller: this.$refs.doccontScroller,
            trigger: this.$refs.doccontImgContent,
            start: 0,
            scrub: true,
          },
          opacity: 1,
        });
      }
    },
    slidesClick: function () {
      if (this.$refs.doccontStory) {
        this.lightboxindex = this.$refs.doccontStory.activeslide;
      }
    },
    slidesEnter: function () {
      if (this.$refs.doccontImgContent) {
        gsap.to(this.$refs.doccontImgContent, {
          scale: 1.025,
          ease: "power.out",
          duration: 0.15
        }).play();
      }
    },
    slidesLeave: function () {
      if (this.$refs.doccontImgContent) {
        gsap.to(this.$refs.doccontImgContent, {
          scale: 1,
          ease: "power.inout",
          duration: 0.3
        }).play();
      }
    },
    openlightboxalt: function (i) {
      this.lightboxindexAlt = i;
    },
    bestImageFromLarge: function (img) {
      if (!img) return { url: "" };
      if (!img.formats) return img;
      if (img.formats.large) return img.formats.large;
      else if (img.formats.medium) return img.formats.medium;
      else if (img.formats.small) return img.formats.small;
      else if (img.formats.thumbnail) return img.formats.thumbnail;
      else return { url: "" };
    }
  },
  mounted: function () {
    if (!this.$fetchState || !this.$fetchState.pending) {
      this.initScrollHooks();
    }
  },
  beforeDestroy: function () {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }
};
</script>
