<template>
  <div class="work-page" ref="workPage">
        <div class="work-content">
    <!-- Category sections with carousels -->
    <template v-for="(cat, index) in categoryGroups">
      <hr
        v-if="isSoftwareCategory(cat) && index > 0"
        :key="'divider-' + cat.slug"
        class="work-category-divider"
      />
      <div :key="cat.slug" :id="cat.slug" class="work-category-section">
        <h2 class="work-category-heading">
          <span>{{ cat.name }}</span>
        </h2>
        <div class="work-category-desc fancy" v-if="cat.description" v-html="$md.render(cat.description)"></div>
        <Carousel
          :documents="cat.documents"
          :ref="'carousel-' + cat.slug"
          :transparent="true"
          :splitAnchor="isSplitAnchorCategory(cat)"
          @docClick="onDocClick"
        />
      </div>
    </template>
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
          <DocumentContent v-if="selectedDocument" :key="selectedDocument"
            :documentSlug="selectedDocument" @close="closeModal" />
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
.work-page {
  width: 100%;
  position: absolute;
  height: 100%;
  top: 0;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  background: var(--backgroundpaper);
  background-attachment: local;
    display: flex;
  flex-direction: column;
  padding-top: var(--headerheight);
}
.work-content {
  margin: auto 0;
  width: 100%;
  box-sizing: border-box;
  padding: 24px 0 32px;
}

.work-goback {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--foregroundlink);
  text-decoration: none;
  font-size: 12px;
  padding: 0 32px;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.work-goback:hover {
  color: white;
}

.work-goback svg {
  height: 14px;
  width: 14px;
  fill: currentColor;
}

.work-category-section {
  margin-bottom: 24px;
}
.work-category-section:last-child {
  margin-bottom: 0;
}

.work-category-divider {
  border: none;
  height: 1px;
  background: var(--foregroundsubtle);
  margin: 32px 32px 40px 32px;
}

.work-category-heading {
    margin: 0 32px 0px 32px;
    color: var(--foregroundhigh);
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.work-category-desc {
  padding: 0 32px;
}

.work-category-desc p {
  max-width: 722px;
  color: var(--foregroundsubtle);
  margin-top: 0;
  margin-bottom: 8px;
}

.animatelink {
  color: var(--foregroundlink);
  position: relative;
  text-decoration: none;
  font-size: 1.5em;
  font-family: var(--font-secondary);
  transition: color 0.3s;
}

.animatelink::after {
  position: absolute;
  width: 0%;
  left: 0;
  bottom: 2px;
  content: "";
  height: 2px;
  transition: width 0.3s;
  background: var(--backgroundclick);
}

.animatelink:hover {
  color: white;
}

.animatelink:hover::after {
  width: 100%;
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
  border: solid 1px rgba(255, 255, 255, 0.1);
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

/* Position buttons outside the max-width modal */
.modal-nav-prev {
  left: max(0px, calc(50% - 505px));
}

.modal-nav-next {
  right: max(0px, calc(50% - 505px));
}

@media (max-width: 600px) {
    .work-content {
    padding: 16px 0 24px;
  }
  .work-goback {
    padding: 0 12px;
  }

  .work-category-heading {
    margin-left: 12px;
    margin-right: 12px;
  }

  .work-category-desc {
    padding: 0 12px;
  }

  .work-category-divider {
    margin: 20px 12px 28px 12px;
  }

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
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DocumentContent from "~/components/DocumentContent.vue";

let cachedWorkData = null;

export default {
  components: { DocumentContent },
  data() {
    return {
      closingDocSlug: null,
      categoryGroups: [],
      selectedDocument: "",
    };
  },
  computed: {
    // Flat ordered list of all navigable documents on this page
    flatDocList() {
      const docs = [];
      for (const cat of this.categoryGroups) {
        for (const doc of cat.documents) {
          if (!doc.nopage && !docs.find((d) => d.slug === doc.slug)) {
            docs.push({ slug: doc.slug, title: doc.title });
          }
        }
      }
      return docs;
    },
    currentDocIndex() {
      return this.flatDocList.findIndex((d) => d.slug === this.selectedDocument);
    },
    prevDoc() {
      return this.currentDocIndex > 0
        ? this.flatDocList[this.currentDocIndex - 1]
        : null;
    },
    nextDoc() {
      return this.currentDocIndex !== -1 && this.currentDocIndex < this.flatDocList.length - 1
        ? this.flatDocList[this.currentDocIndex + 1]
        : null;
    },
  },
  watch: {
    $route(to, from) {
      this.handleRouteUpdate(to, from);
    }
  },
  methods: {
    isSplitAnchorCategory(cat) {
      if (!cat) return false;
      const s = (cat.slug || "").toLowerCase();
      const n = (cat.name || "").toLowerCase();
      return (
        s.includes("commercial") ||
        s.includes("narrative") ||
        n.includes("commercial") ||
        n.includes("narrative")
      );
    },
    isSoftwareCategory(cat) {
      if (!cat) return false;
      const s = (cat.slug || "").toLowerCase();
      const n = (cat.name || "").toLowerCase();
      return s.includes("software") || n.includes("software");
    },
    handleRouteUpdate(to, from) {
      const slug = to.params.slug || "";
      const oldSlug = from ? (from.params.slug || "") : "";
      const isCat = this.categoryGroups.some((c) => c.slug === slug || slug === 'camera');
      if (oldSlug && !slug) {
        this.closingDocSlug = oldSlug;
      }
      this.selectedDocument = (!isCat && slug) ? slug : null;
      if (this.selectedDocument) {
        if (this.$refs.workPage) this.$refs.workPage.style.overflow = "hidden";
      } else {
        if (this.$refs.workPage) this.$refs.workPage.style.overflow = "";
      }
      if (to.hash) {
        this.$nextTick(() => {
          const target = document.querySelector(to.hash);
          if (target && this.$refs.workPage) {
            this.$refs.workPage.scrollTo({ top: target.offsetTop - 6, behavior: "smooth" });
          }
        });
      }
    },
    onDocClick(doc, el) {
      this.selectedDocument = doc.slug;
      if (this.$refs.workPage) this.$refs.workPage.style.overflow = "hidden";
    },
    goToDoc(doc) {
      if (!doc) return;
      const targetIndex = this.flatDocList.findIndex((d) => d.slug === doc.slug);
      const direction = targetIndex > this.currentDocIndex ? 1 : -1;
      const container = this.$refs.modalContainer;
      const newPath = "/work/" + doc.slug + "/";
      
      if (!container) {
        this.selectedDocument = doc.slug;
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
          
          // Set flag to avoid double animation and match new category
          this.$store.commit("setInternalNavigation", true);
          this.selectedDocument = doc.slug;
          
          this.$router.replace({ path: newPath, query: this.$route.query }).catch(e => {
            if (e.name !== 'NavigationDuplicated') throw e;
          });

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
    createClone(el) {
      const rect = el.getBoundingClientRect();
      const clone = el.cloneNode(true);

      clone.style.position = "fixed";
      clone.style.top = rect.top + "px";
      clone.style.left = rect.left + "px";
      clone.style.width = rect.width + "px";
      clone.style.height = rect.height + "px";
      clone.style.margin = "0";
      clone.style.pointerEvents = "none";
      clone.style.transformOrigin = "center center";

      clone.style.zIndex = "120";

      document.body.appendChild(clone);

      return { clone, rect };
    },
    closeModal() {
      this.closingDocSlug = this.selectedDocument;
      this.selectedDocument = null;
      if (this.$route.query.context === 'home') {
        this.$router.push('/');
      } else {
        this.$router.push({ 
          path: '/work/', 
          query: this.$route.query 
        });
      }
    },

    // --- Transition hooks (JS-driven, no CSS) ---
    modalBeforeEnter(el) {
      el.style.opacity = "1"; // important: don't fade the whole thing
    },
    modalEnter(el, done) {
      const isInternal = this.$store.state.isInternalNavigation;
      const clickedRect = this.$store.state.clickedDocRect;
      const container = el.querySelector(".modal-container");

      // If we're already in the modal and just navigating between docs,
      // let the manual goToDoc animation handle things.
      if (isInternal) {
        gsap.set(el, { opacity: 1 });
        this.$store.commit("setInternalNavigation", false);
        done();
        return;
      }

      if (!clickedRect || !container) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, onComplete: done });
        return;
      }

      gsap.set(el, { opacity: 1 });

      this.$nextTick(() => {
        requestAnimationFrame(() => {
          const finalRect = container.getBoundingClientRect();

          // --- calculate transform from thumbnail → modal ---
          const scaleX = clickedRect.width / finalRect.width;
          const scaleY = clickedRect.height / finalRect.height;

          const startCX = clickedRect.left + clickedRect.width / 2;
          const startCY = clickedRect.top + clickedRect.height / 2;

          const endCX = finalRect.left + finalRect.width / 2;
          const endCY = finalRect.top + finalRect.height / 2;

          const dx = startCX - endCX;
          const dy = startCY - endCY;

          // set initial state
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

          // backdrop
          tl.fromTo(el,
            {
              backgroundColor: "rgba(0,0,0,0)",
              backdropFilter: "blur(0px)",
              WebkitBackdropFilter: "blur(0px)",
            },
            {
              backgroundColor: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              duration: 0.35,
              ease: "power2.out",
            },
            0
          );

          // modal motion
          tl.to(container, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            duration: 0.4,
            ease: "power3.inOut",
          }, 0);
        });
      });
    },
    modalLeave(el, done) {
      const docSlug = this.closingDocSlug;
      const container = el.querySelector(".modal-container");

      let targetEl = null;
      // --- find + scroll target into view ---
      for (const key of Object.keys(this.$refs)) {
        if (key.startsWith("carousel-")) {
          const carousel = Array.isArray(this.$refs[key])
            ? this.$refs[key][0]
            : this.$refs[key];

          if (carousel && carousel.scrollDocIntoView) {
            const found = carousel.scrollDocIntoView(docSlug, "auto");
            if (found) {
              targetEl = found;
              break;
            }
          }
        }
      }

      if (!container || !targetEl) {
        gsap.to(el, { opacity: 0, duration: 0.2, onComplete: done });
        return;
      }

      // --- wait for scroll/layout to settle ---
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          const startRect = container.getBoundingClientRect();
          const endRect = targetEl.getBoundingClientRect();

          // --- SAME MATH as enter, but reversed direction ---
          const scaleX = endRect.width / startRect.width;
          const scaleY = endRect.height / startRect.height;

          const startCX = startRect.left + startRect.width / 2;
          const startCY = startRect.top + startRect.height / 2;

          const endCX = endRect.left + endRect.width / 2;
          const endCY = endRect.top + endRect.height / 2;

          const dx = endCX - startCX;
          const dy = endCY - startCY;
          console.log({
            startRect,
            endRect,
            dx,
            dy,
            scaleX,
            scaleY
          });

          // ensure consistent baseline
          gsap.set(container, {
            transformOrigin: "center center",
          });

          const tl = gsap.timeline({
            onComplete: done,
          });

          // --- backdrop (reverse of enter) ---
          tl.to(
            el,
            {
              backgroundColor: "rgba(0,0,0,0)",
              backdropFilter: "blur(0px)",
              WebkitBackdropFilter: "blur(0px)",
              duration: 0.35,
              ease: "power2.in",
            },
            0
          );

          // --- modal motion (reverse of enter) ---
          tl.to(
            container,
            {
              x: dx,
              y: dy,
              scaleX,
              scaleY,
              opacity: 0,
              duration: 0.4,
              ease: "power3.inOut",
            },
            0
          );
        });
      });
    },
    modalAfterLeave() {
      if (this.$refs.workPage) {
        this.$refs.workPage.style.overflow = "";
      }
    }
  },
  mounted() {
    this.handleRouteUpdate(this.$route, null);
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
    if (this._onKeydown) window.removeEventListener("keydown", this._onKeydown);
  },
  head() {
    let title = "Cinematography Portfolio | Piers Deseilligny - DoP Scotland";
    let description = "Commercial and short narrative cinematography portfolio of Piers Deseilligny, Director of Photography based in Scotland.";
    const currentPath = "https://piersdeseilligny.com/work/" + (this.selectedDocument ? this.selectedDocument + '/' : '');

    if (this.selectedDocument) {
      const doc = this.flatDocList.find((d) => d.slug === this.selectedDocument);
      if (doc && doc.title) {
        title = `${doc.title} | Piers Deseilligny - Cinematographer Scotland`;
        description = `${doc.title} - Cinematography and camera work by Director of Photography Piers Deseilligny.`;
      }
    }
    return {
      title,
      meta: [
        { hid: "description", name: "description", content: description },
        { hid: "og:title", property: "og:title", content: title },
        { hid: "og:site_name", property: "og:site_name", content: "Piers Deseilligny" },
        { hid: "og:url", property: "og:url", content: currentPath },
        { hid: "og:description", property: "og:description", content: description },
        { hid: "og:type", property: "og:type", content: "website" },
        { hid: "twitter:card", name: "twitter:card", content: "summary_large_image" },
        { hid: "twitter:title", name: "twitter:title", content: title },
        { hid: "twitter:description", name: "twitter:description", content: description },
      ],
      link: [
        { rel: "canonical", href: currentPath }
      ]
    };
  },
  async asyncData(context) {
    const { params, store, $staticAPI, error, route, redirect } = context;
    const slug = params.slug;

    try {
      // Handle redirect for old /work/camera
      if (slug === 'camera') {
        return redirect(301, '/work/', route.query);
      }

      let data = cachedWorkData;
      if (!data) {
        const query = `
          query {
            categories(sort:"order:asc") {
              slug, order, name, description, title,
              documents {
                id: documentId, title, slug, date, order,
                np_link, backgroundcolor, foregroundcolor, foregroundcolor2,
                nopage,
                category { slug },
                categories { slug },
                tags { name, id: documentId, icon, title, order },
                images { formats },
                poster { formats },
                moreinfo { link, header, subheader, outlink { svg, tooltip, name } }
              }
            }
          }
        `;

        data = await $staticAPI({ query });
        cachedWorkData = data;
      }

      // Filter out 'camera'
      const activeCategories = data.categories.filter((c) => c.slug !== 'camera');
      activeCategories.sort((a, b) => (a.order > b.order ? 1 : -1));

      // If slug matches a category, redirect to /work/#category
      if (slug && activeCategories.some((c) => c.slug === slug)) {
        return redirect(301, `/work/#${slug}`, route.query);
      }

      // Collect all documents across active categories
      const allDocs = activeCategories.flatMap((c) => c.documents || []);

      // If slug is provided, check if it exists as a document
      let selectedDocument = "";
      if (slug) {
        const docExists = allDocs.some((d) => d.slug === slug);
        if (!docExists) {
          return error({ statusCode: 404, message: "Page not found" });
        }
        selectedDocument = slug;
      }

      const categoryGroups = [];

      for (const cat of activeCategories) {
        const catDocs = (cat.documents || []).filter((doc) => !doc.nopage);

        if (catDocs.length > 0) {
          const docs = catDocs.map((doc) => {
            const d = { ...doc };
            d.category = { slug: cat.slug, name: cat.name };
            d.key = `${cat.slug}-${d.slug}`;
            return d;
          });

          categoryGroups.push({
            slug: cat.slug,
            name: cat.name,
            title: cat.title,
            description: cat.description,
            documents: docs,
          });
        }
      }

      return {
        categoryGroups,
        selectedDocument,
      };
    } catch (err) {
      return error({ statusCode: 404, message: err.message });
    }
  },
};
</script>