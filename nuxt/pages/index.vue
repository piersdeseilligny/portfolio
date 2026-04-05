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
          <p class="fancy"><a href="mailto:contact@piersdeseilligny.com">contact@piersdeseilligny.com</a></p>
          <Links class="indexcontainer-links" />
        </div>
      </div>
    </div>
    <h2 class="alth2 featured-work-title padder" style="margin-top:24px;margin-bottom:12px;">
      <span style="margin-right:12px;">Featured work</span>
      <a class="showanother arrow" href="/work/">
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path
            d="M13.854 8.14576L8.854 3.14576C8.659 2.95076 8.342 2.95076 8.147 3.14576C7.952 3.34076 7.952 3.65776 8.147 3.85276L12.293 7.99876H2.5C2.224 7.99876 2 8.22276 2 8.49876C2 8.77476 2.224 8.99876 2.5 8.99876H12.293L8.147 13.1448C7.952 13.3398 7.952 13.6568 8.147 13.8518C8.245 13.9498 8.373 13.9978 8.501 13.9978C8.629 13.9978 8.757 13.9488 8.855 13.8518L13.855 8.85176C14.05 8.65676 14.05 8.33976 13.855 8.14476L13.854 8.14576Z" />
        </svg>
        View all
      </a>
    </h2>
    <Carousel :documents="home.featured" />
    <div class="randomsample">
      <div class="padder">
        <h2 class="alth2" style="margin-top:24px"><span style="margin-right:12px;">Random sample</span>
          <div ref="showanother" class="showanother" @click.prevent="randomImage(true)">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path
                d="M3 8C3 5.23858 5.23858 3 8 3C9.63527 3 11.0878 3.78495 12.0005 5H10C9.72386 5 9.5 5.22386 9.5 5.5C9.5 5.77614 9.72386 6 10 6H12.8904C12.8973 6.00014 12.9041 6.00014 12.911 6H13C13.2761 6 13.5 5.77614 13.5 5.5V2.5C13.5 2.22386 13.2761 2 13 2C12.7239 2 12.5 2.22386 12.5 2.5V4.03138C11.4009 2.78613 9.79253 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.1301 14 13.6999 11.6035 13.9756 8.54488C14.0003 8.26985 13.7975 8.0268 13.5225 8.00202C13.2474 7.97723 13.0044 8.1801 12.9796 8.45512C12.75 11.003 10.6079 13 8 13C5.23858 13 3 10.7614 3 8Z" />
            </svg>
            Show another
          </div>
        </h2>
        <hr />
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

    <!-- Document modal overlay -->
    <transition name="modal" @before-enter="modalBeforeEnter" @enter="modalEnter" @leave="modalLeave"
      @after-leave="modalAfterLeave" :css="false">
      <div v-if="selectedDocument" class="modal-backdrop" ref="modalBackdrop" @click.self="closeModal">
        <button v-if="prevDoc" class="modal-nav modal-nav-prev" @click="goToDoc(prevDoc)" title="Previous document">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
          </svg>
        </button>
        <div class="modal-container" ref="modalContainer">
          <DocumentContent :key="selectedDocument" :categorySlug="selectedCategory" :documentSlug="selectedDocument"
            @close="closeModal" />
        </div>
        <button v-if="nextDoc" class="modal-nav modal-nav-next" @click="goToDoc(nextDoc)" title="Next document">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
          </svg>
        </button>
      </div>
    </transition>
  </div>


</template>
<style>
hr {
  border: none;
  height: 1px;
  margin-top: 12px;
  opacity: 0.25;
  background: var(--foregroundlink);
}

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
  text-decoration: none;
  display: block;
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
  transform: rotate(0), translateX(0);
  transition: transform 0.2s;
  display: inline-block;
  vertical-align: middle;
}

.showanother.arrow:hover svg {
  transform: translateX(-2px);
}

.showanother:hover svg {
  transform: rotate(-20deg);
}

.showanother.arrow:hover svg {
  transform: translateX(2px);
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

/* Modal overlay */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 6vh 24px;
}

.modal-container {
  width: 100%;
  max-width: 900px;
  height: 88vh;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
  position: relative;
  z-index: 210;
  will-change: transform, opacity;
}

/* Modal prev/next nav buttons */
.modal-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 220;
  background: transparent;
  border: none;
  width: 48px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--foregroundhigh);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  flex-shrink: 0;
}

.modal-nav svg {
  width: 36px;
  height: 36px;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.modal-nav:hover {
  color: white;
}

.modal-nav:hover svg {
  transform: scale(1.15);
}

.modal-nav-prev {
  left: max(0px, calc(50% - 505px));
}

.modal-nav-next {
  right: max(0px, calc(50% - 505px));
}

@media (max-width: 600px) {
  .modal-backdrop {
    padding: 0;
  }

  .modal-container {
    max-width: 100%;
    height: 100vh;
    border-radius: 0;
  }

  /* On mobile, anchor buttons to the bottom corners */
  .modal-nav {
    width: 60px;
    height: 60px;
    top: auto;
    bottom: 0px;
    transform: none;
    background: linear-gradient(0deg, var(--backgroundpaper), transparent);
  }

  .modal-nav svg {
    width: 32px;
    height: 32px;
  }

  .modal-nav:hover svg {
    transform: scale(1.1);
  }

  .modal-nav-prev {
    left: 0px;
  }

  .modal-nav-next {
    right: 0px;
  }
}
</style>
<script>
import { gsap } from "gsap";
import DocumentContent from "~/components/DocumentContent.vue";
export default {
  components: { DocumentContent },
  data() {
    return {
      categories: [{ name: "test" }],
      featuredCanScrollLeft: false,
      featuredCanScrollRight: false,
      imageindex: 0,
      selectedDocument: null,
      selectedCategory: null,
      closingDocSlug: null,
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
  computed: {
    flatDocList() {
      return this.home.featured ? this.home.featured.filter(doc => !doc.nopage) : [];
    },
    currentDocIndex() {
      return this.flatDocList.findIndex((d) => d.slug === this.selectedDocument);
    },
    prevDoc() {
      return this.currentDocIndex > 0 ? this.flatDocList[this.currentDocIndex - 1] : null;
    },
    nextDoc() {
      return this.currentDocIndex !== -1 && this.currentDocIndex < this.flatDocList.length - 1 ? this.flatDocList[this.currentDocIndex + 1] : null;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.query.context === 'home' && to.params.document && to.params.slug) {
      this.selectedDocument = to.params.document;
      this.selectedCategory = to.params.slug;

      // Update the URL manually, keeping us on the current vue-router route conceptually
      window.history.pushState({}, '', to.fullPath);
      next(false); // abort vue-router navigation
    } else {
      next(); // proceed normally
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
    goToDoc(doc) {
      if (!doc) return;
      const targetIndex = this.flatDocList.findIndex((d) => d.slug === doc.slug);
      const direction = targetIndex > this.currentDocIndex ? 1 : -1;
      const container = this.$refs.modalContainer;

      const newPath = "/work/" + doc.category.slug + "/" + doc.slug + "/?context=home";

      if (!container) {
        this.selectedDocument = doc.slug;
        this.selectedCategory = doc.category.slug;
        window.history.replaceState({}, '', newPath);
        return;
      }

      gsap.to(container, {
        x: direction * -30,
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(container, { opacity: 0, x: direction * 30 });
          
          this.selectedDocument = doc.slug;
          this.selectedCategory = doc.category.slug;
          window.history.replaceState({}, '', newPath);

          this.$nextTick(() => {
            setTimeout(() => {
              gsap.fromTo(
                container,
                { x: direction * 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.25, ease: "power2.out" }
              );
            }, 40);
          });
        },
      });
    },
    closeModal() {
      this.closingDocSlug = this.selectedDocument;
      this.selectedDocument = null;
      this.selectedCategory = null;
      window.history.pushState({}, '', '/');
    },
    onPopState(event) {
      if (this.selectedDocument && location.pathname === '/') {
        this.closingDocSlug = this.selectedDocument;
        this.selectedDocument = null;
        this.selectedCategory = null;
      }
    },
    // --- Transition hooks (JS-driven, no CSS) ---
    modalBeforeEnter(el) {
      el.style.opacity = "1";
    },
    modalEnter(el, done) {
      const clickedRect = this.$store.state.clickedDocRect;
      const container = el.querySelector(".modal-container");

      if (!clickedRect || !container) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, onComplete: done });
        return;
      }

      gsap.set(el, { opacity: 1 });

      this.$nextTick(() => {
        requestAnimationFrame(() => {
          const finalRect = container.getBoundingClientRect();

          const scaleX = clickedRect.width / finalRect.width;
          const scaleY = clickedRect.height / finalRect.height;
          const startCX = clickedRect.left + clickedRect.width / 2;
          const startCY = clickedRect.top + clickedRect.height / 2;
          const endCX = finalRect.left + finalRect.width / 2;
          const endCY = finalRect.top + finalRect.height / 2;

          const dx = startCX - endCX;
          const dy = startCY - endCY;

          gsap.set(container, {
            x: dx,
            y: dy,
            scaleX,
            scaleY,
            opacity: 0,
            transformOrigin: "center center",
          });

          const tl = gsap.timeline({
            onComplete: () => {
              this.$store.commit("clearClickedDoc");
              done();
            }
          });

          tl.fromTo(el,
            { backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)" },
            { backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", duration: 0.35, ease: "power2.out" },
            0
          );

          tl.to(container, {
            x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.4, ease: "power3.inOut"
          }, 0);
        });
      });
    },
    modalLeave(el, done) {
      const docSlug = this.closingDocSlug;
      const container = el.querySelector(".modal-container");

      let targetEl = null;
      // We can use the carousel reference to find the thumbnail
      const carousels = this.$children.filter(c => c.$options._componentTag === 'Carousel' || c.scrollDocIntoView);
      for (const carousel of carousels) {
        if (carousel.scrollDocIntoView) {
          const found = carousel.scrollDocIntoView(docSlug, "auto");
          if (found) {
            targetEl = found;
            break;
          }
        }
      }

      if (!container || !targetEl) {
        gsap.to(el, { opacity: 0, duration: 0.2, onComplete: done });
        return;
      }

      this.$nextTick(() => {
        requestAnimationFrame(() => {
          const startRect = container.getBoundingClientRect();
          const endRect = targetEl.getBoundingClientRect();

          const scaleX = endRect.width / startRect.width;
          const scaleY = endRect.height / startRect.height;
          const startCX = startRect.left + startRect.width / 2;
          const startCY = startRect.top + startRect.height / 2;
          const endCX = endRect.left + endRect.width / 2;
          const endCY = endRect.top + endRect.height / 2;

          const dx = endCX - startCX;
          const dy = endCY - startCY;

          gsap.set(container, { transformOrigin: "center center" });

          const tl = gsap.timeline({ onComplete: done });

          tl.to(el,
            { backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", duration: 0.35, ease: "power2.in" },
            0
          );

          tl.to(container,
            { x: dx, y: dy, scaleX, scaleY, opacity: 0, duration: 0.4, ease: "power3.inOut" },
            0
          );
        });
      });
    },
    modalAfterLeave() {
      document.body.style.overflow = "";
    }
  },
  watch: {
    selectedDocument(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
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

    window.addEventListener('popstate', this.onPopState);

    this._onKeydown = (e) => {
      if (!this.selectedDocument) return;
      if (e.key === "ArrowLeft" && this.prevDoc) {
        e.preventDefault();
        this.goToDoc(this.prevDoc);
      } else if (e.key === "ArrowRight" && this.nextDoc) {
        e.preventDefault();
        this.goToDoc(this.nextDoc);
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.closeModal();
      }
    };
    window.addEventListener("keydown", this._onKeydown);
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.onPopState);
    if (this._onKeydown) window.removeEventListener("keydown", this._onKeydown);
  },
  head() {
    return {
      title: "Piers Deseilligny - Director of Photography",
      description: this.home.metadescription,
      meta: [
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
