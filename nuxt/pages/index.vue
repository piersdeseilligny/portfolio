<template>

    <div class="home">
      <div class="showreel-container">
        <video-embed src="https://vimeo.com/866827389"></video-embed>
      </div>
      <div class="padder">
        <div class="indexcontainer">
          <div class="indexcontainer-about">
            <h2 class="alth2" style="margin-top:24px">About me</h2>
            <div class="fancy" v-html="home.description"></div>
          </div>
          <div class="indexcontainer-contact">
            <h2 class="alth2" style="margin-top:24px">Get in touch</h2>
            <p class="fancy"><a
                href="mailto:contact@piersdeseilligny.com">contact@piersdeseilligny.com</a></p>
            <Links class="indexcontainer-links" />
          </div>
        </div>
      </div>
      <h2 class="alth2 featured-work-title" style="margin-top:24px">Featured work</h2>
      <div class="featured-work-container">
        <div class="featured-work-track" ref="featuredScrollTrack" @scroll="featuredCheckScroll()">
          <template v-for="document in home.featured">
            <Document :key="document.id + 'doc'" ref="docs" :link="{
              path: '/work/' + document.category.slug + '/' + document.slug + '/',
              query: $route.query,
            }" :doc="document" />
          </template>
        </div>
        <button @click="featuredScroll('left')"
          :class="{ 'featured-work-previous': true, 'cantScroll': !featuredCanScrollLeft }"><svg
            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
          </svg></button>
        <button @click="featuredScroll('right')"
          :class="{ 'featured-work-next': true, 'cantScroll': !featuredCanScrollRight }"><svg
            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
          </svg></button>
      </div>
      <div class="randomsample">
        <div class="padder">
          <h2 class="alth2" style="margin-top:24px"><span style="margin-right:12px;">Random sample</span>
            <div ref="showanother" class="showanother" @click.prevent="randomImage(true)">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                y="0px" viewBox="0 0 14 12.5" style="enable-background:new 0 0 14 12.5;" xml:space="preserve">
                <polygon fill="currentColor" points="1.5,1.1 2.5,2.1 5,2.1 5,4.6 6,5.6 6,1.1 " />
                <path fill="currentColor" d="M8.7,1.6L8.4,2.5c1.5,0.6,2.6,2,2.6,3.7c0,2.2-1.8,4-4,4s-4-1.8-4-4c0-1.6,0.9-3,2.3-3.6l0.4-1.2C3.6,2,2,3.9,2,6.3
            	c0,2.8,2.2,5,5,5s5-2.2,5-5C12,4.1,10.6,2.3,8.7,1.6z" />
              </svg>
              Show another
            </div>
          </h2>
          <p class="fancy" v-html="hero.caption"></p>
          <div class="content-tags" style="--fgcolor:var(--foreground);margin-top:0px;margin-bottom:0;"
            v-if="hero.document">
            <span v-for="tag in hero.document.tags" :key="tag.id"><i v-html="tag.icon"></i>{{ tag.name
            }}&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
        <div
          :style="`position:relative;padding-top:${(hero.image.height / hero.image.width) * 100}%;transition: padding-top 0.2s;`">
          <img id="randomimage" alt="" @load="loadimage" style="position:absolute;top:0;left:0;right:0;width:100%;"
            :src="hero.image.url">
        </div>
      </div>
          <div>
      <div class="footer" style="padding-top:72px">
        <span class="copyright">©{{ new Date().getFullYear() }} Piers Deseilligny</span>
        <span>This website is <a class="fancy" rel="noopener" target="_blank"
            href="https://github.com/piersdeseilligny/portfolio">open-source</a></span>
      </div>
    </div>
    </div>



</template>
<style>
.footer {
  font-size: 11px;
  color: rgba(215, 237, 255, 0.4);
  background-color: var(--backgroundhigh);
  text-align: center;
  padding: 24px;
}

.copyright {
  display: block;
  margin-bottom: 0px;
  font-size: 13px;
}

.indexcontainer {
  display: flex;
  --rightmargin: 48px;
}

.indexcontainer-contact {
  flex-direction: column;
  flex-basis: 25%;
  flex-shrink: 0;
}

.indexcontainer-contact .indexcontainer-links {
  display: block;
}

.highlighted {
  background: var(--background7);
  background-clip: text;
  font-weight: bold;
  margin-top: 6px;
  margin-right: var(--rightmargin);
  color: transparent;
  font-size: 18px;
}

.home {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-top: var(--headerheight);
  box-sizing: border-box;
  background: var(--backgroundpaper);
  background-attachment: local;
}

.padder {
  padding-right: var(--sidepadding);
  padding-left: var(--sidepadding);
}

p {
  font-size: 1rem;
}

.home p {
  color: rgba(215, 237, 255, 0.5);
  margin-right: var(--rightmargin);
  text-align: justify;
}

h1.emphasis {
  font-family: var(--font-secondary);
  position: relative;
}

h2.emphasis {
  font-family: var(--font-secondary);
  font-size: 1.5em;
  opacity: 0.8;
  margin-top: 17px;
  padding-bottom: 5px;
  box-sizing: border-box;
  position: relative;
}

h1.emphasis::after,
h2.emphasis:not(.noline)::after {
  content: " ";
  position: absolute;
  bottom: 0;
  left: 0;
  right: var(--rightmargin);
  height: 1px;
  background: var(--background6);
  border: none;
  transition: 0.15s cubic-bezier(0.215, 0.610, 0.355, 1);
}

h2.emphasis.noline {
  margin-bottom: -20px;
}

.showreel-container {
  background: black;
  position: relative;
  height: 0;
  padding-bottom: 50%;
  overflow: hidden;
  /* Not needed if it's a block element, like a div */
  width: 100%;
  margin-top: 0px;
  box-sizing: border-box;
}

.randomsample img {
  object-fit: cover;
  width: 100%;
  margin-top: 24px;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.5);
}

.randomsampleflex {
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
}

.randomsampleflex p {
  margin: 0;
}

.randomsampleflex>p {
  flex-grow: 1;
  margin-top: 12px;
}

.showanother {
  color: #6678ac;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  font-family: var(--font-primary);
  font-weight: 400;
  font-size: 0.8rem;
  transition: color 0.2s;
  user-select: none;
}

.showanother:hover {
  color: hsl(202deg 36% 52%);
}

.showanother:active {
  color: hsl(202deg 36% 75%);
}

.showanother svg {
  margin-top: -2px;
  height: 18px;
  transform: rotate(0);
  transition: transform 0.2s;
  display: inline-block;
  vertical-align: middle;
}

.showanother:hover svg {
  transform: rotate(-20deg);
}


a.fancy,
.fancy a {
  text-decoration: none;
  position: relative;
  color: var(--foregroundlink);
  transition: color 0.3s;
}

a.fancy.fancysubtle {
  color: var(--foregroundsubtle);
}

a.fancy:hover,
.fancy a:hover {
  color: white;
}

a.fancy.fancysubtle:hover {
  color: var(--foregroundlink);
}

a.fancy::after,
.fancy a::after {
  position: absolute;
  width: 0%;
  left: 0;
  bottom: 0;
  content: '';
  height: 2px;
  transition: width 0.3s;
  background: var(--backgroundclick);
}

a.fancy:active,
.fancy a:active {
  background: var(--backgroundclick);
  background-clip: text;
  color: transparent;
  transition: color 0s;
}

a.fancy:hover::after,
.fancy a:hover::after {
  width: 100%;
}

@keyframes svgrotate {
  from {
    transform: rotate(-380deg);
  }
}

.showanother.rotating svg {
  animation-name: svgrotate;
  animation-duration: 0.4s;
}

@media screen and (max-width: 820px) {
  .indexcontainer {
    --rightmargin: 0;
    flex-direction: column;
  }

  .indexcontainer .indexcontainer-links {
    display: flex;
  }
}

@media screen and (max-width: 600px) {
  .showreel-container {
    margin-left: -12px;
    margin-right: -12px;
    width: calc(100% + 24px);
  }
}

.showreel-container * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.featured-work-title {
  margin-right: var(--sidepadding);
  margin-left: var(--sidepadding);
}

.featured-work-container {
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.2);
  background: var(--background1color);
  margin-top: 6px;
  position: relative;
}

.featured-work-track {
  display: flex;
  padding-right: 24px;
  padding-left: 24px;
  padding-top: 12px;
  padding-bottom: 24px;
  overflow-x: scroll;
  scrollbar-width: none;
}

.featured-work-track>a {
  width: 240px;
  flex-shrink: 0;
  height: 120px;
}

.featured-work-container button {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 48px;
  z-index: 1;
  border: none;
  cursor: pointer;
  background: transparent;
  transition: opacity 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.featured-work-container button.cantScroll {
  opacity: 0;
}

.featured-work-container button svg {
  width: 36px;
  height: 100%;
  top: 0;
  bottom: 0;
  position: absolute;
  color: var(--foregroundhigh);
  right: 12px;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.featured-work-container button:hover svg {
  color: white;
  transform: scale(1.1);
}

.featured-work-previous.cantScroll svg {
  opacity: 0;
  transform: translateX(12px);
}

.featured-work-next.cantScroll svg {
  opacity: 0;
  transform: translateX(-12px);
}

.featured-work-previous {
  left: 0;
}

.featured-work-previous::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: -160px;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(270deg, transparent, hsl(195, 10%, 8%));
}

.featured-work-previous svg {
  right: auto;
  left: 12px;
}

.featured-work-next {
  right: 0;
}

.featured-work-next::before {
  content: '';
  position: absolute;
  top: 0;
  left: -160px;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, hsl(195, 10%, 8%));
}

@media (max-width:600px) {
  .featured-work-previous::before {
    right: -60px;
  }

  .featured-work-next::before {
    left: -60px;
  }
}
</style>
<script>
import { gsap } from "gsap";
export default {
  data() {
    return {
      categories: [{ name: "test" }],
      featuredCanScrollLeft: false,
      featuredCanScrollRight: false,
      error: {},
      imageindex: 0,
      home: {
        description: "",
        subtitle: "",
        underconstruction: false,
        images: [],
        featured: []
      },
      hero: {
        document: {
          tags: []
        },
        image: {
          url: ""
        },
        caption: ""
      }
    }
  },
  methods: {
    randomImage: function (onclick) {
      gsap.to("#randomimage", { opacity: 0, duration: 0.2 });
      this.hero = this.home.images[this.imageindex];
      if (this.imageindex == this.home.images.length - 1) {
        this.imageindex = 0;
      }
      else {
        this.imageindex++;
      }
      this.$refs.showanother.classList.add('rotating');
      setTimeout(() => { this.$refs.showanother.classList.remove('rotating'); }, 400);
      if (onclick && this.$matomo) {
        this.$matomo.trackEvent('Clicks', 'Show another image');
      }
    },
    loadimage: function () {
      gsap.to("#randomimage", { opacity: 1, duration: 0.2 });
    },
    featuredCheckScroll() {
      const el = this.$refs.featuredScrollTrack;
      if (!el) return;
      this.featuredCanScrollLeft = el.scrollLeft > 0;
      this.featuredCanScrollRight = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth;
    },
    featuredScroll(direction) {
      const el = this.$refs.featuredScrollTrack;
      const scrollAmount = el.clientWidth - 120;
      if (direction == 'left') {
        el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    },
  },
  mounted() {
    function shuffleArray(array) {
      let curId = array.length;
      while (0 !== curId) {
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
      }
      return array;
    }
    this.home.images = shuffleArray(this.home.images);
    this.randomImage();
    this.featuredCheckScroll();
    window.addEventListener('resize', this.featuredCheckScroll);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.featuredCheckScroll);
  },
  head() {
    return {
      title: "Piers Deseilligny - Camera Department",
      description: this.home.metadescription,
      meta: [
        { hid: 'og-title', property: 'og:title', content: 'Piers Deseilligny - Camera Department' },
        { hid: 'description', name: 'description', content: this.home.metadescription },
        { hid: 'og-description', property: 'og:description', content: this.home.subtitle },
        { hid: 'og-image', property: 'og:image', content: "https://piersdeseilligny.com" + this.home.metaimage.url },
        { hid: 'og-type', property: 'og:type', content: "website" },
        { hid: 'og-url', property: 'og:url', content: "https://piersdeseilligny.com/" }
      ]
    }
  },
  async asyncData(context) {
    console.log(context);
    try {
      const data = await context.$staticAPI({
        query: `
          query {
              home{
                description,
                metadescription,
                metaimage{
                  url
                },
                subtitle,
                underconstruction,
                images{
                  document{
                    tags{
                      name,
                      icon
                    }
                  }
                  image{
                    url,
                    width,
                    height
                  },
                  caption
                },
                featured(sort:"order"){
                    order,
                    title,
                    tags{
                      name
                    },
                    date,
                    id,
                    backgroundcolor,
                    foregroundcolor,
                    foregroundcolor2,
                    images{
                      formats
                    }
                    slug,
                    category{
                      slug
                    },
                    categories{
                      slug
                    }
                }
              },
              categories(sort:"order"){
                name,
                id,
                slug,
                thumbnailimage{
                  formats
                },
                thumbnailvideo{
                  url
                },
                title
              }
          }
          `
      });
      data.home.featured.sort((a, b) => {
        return a.category.order > b.category.order ? 1 : -1;
      });
      data.home.description = context.$md.render(data.home.description);

      for (let image of data.home.images) {
        //Download all images
        image.image.url = context.$staticAsset(context.$config.strapiBaseUri + image.image.url);
        if (image.caption) image.caption = context.$md.render(image.caption);
      }
      if (data.home.metaimage) {
        data.home.metaimage.url = context.$staticAsset(context.$config.strapiBaseUri + data.home.metaimage.url);
      }
      else {
        data.home.metaimage = { url: "" };
      }

      console.log(data.home.images)
      const home = data.home;
      const categories = data.categories;
      return { categories, home }
    }
    catch (err) {
      context.error({ message: err.message, statusCode: 404 });
    }
  },
}
</script>
