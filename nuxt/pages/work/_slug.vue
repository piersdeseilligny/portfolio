<template>
  <div class="work-page" ref="workPage">
    <!-- Back to all work -->
    <nuxt-link v-if="selectedCategory" class="work-goback" :to="{ path: '/work/', query: $route.query }">
      <svg>
        <polygon points="13.1,5.8 2.2,5.8 7.3,1.2 6.7,0.5 0.2,6.3 6.7,12 7.3,11.3 2.2,6.8 13.1,6.8" />
      </svg>
      View all work
    </nuxt-link>

    <!-- Category sections with tag carousels -->
    <template v-for="cat in categoryGroups">
      <div :key="cat.slug" class="work-category-section">
        <h2 class="work-category-heading lined" :class="{ hideline: selectedCategory }">
          <nuxt-link :id="cat.slug" class="animatelink" :title="cat.title"
            :to="{ path: '/work/' + cat.slug + '/', query: $route.query }"><span>{{ cat.name }}</span></nuxt-link>
        </h2>
        <div class="work-category-desc fancy" v-if="cat.description" v-html="$md.render(cat.description)"></div>
        <Carousel v-for="tagGroup in cat.tagGroups" :key="cat.slug + '-' + tagGroup.tag.id" :title="tagGroup.tag.name"
          :icon="tagGroup.tag.icon" :description="tagGroup.tag.title" :documents="tagGroup.documents"
          :ref="'carousel-' + cat.slug + '-' + tagGroup.tag.id" @docClick="onDocClick" />
      </div>
    </template>

    <!-- Document modal overlay -->
    <transition name="modal" @before-enter="modalBeforeEnter" @enter="modalEnter" @leave="modalLeave"
      @after-leave="modalAfterLeave" :css="false">
      <div v-if="$route.params.document" class="modal-backdrop" ref="modalBackdrop" @click.self="closeModal">
        <button v-if="prevDoc" class="modal-nav modal-nav-prev" @click="goToDoc(prevDoc)" title="Previous document">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
          </svg>
        </button>
        <div class="modal-container" ref="modalContainer">
          <DocumentContent v-if="selectedDocument" :key="selectedDocument" :categorySlug="selectedCategory"
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
  padding-top: calc(var(--headerheight) + 16px);
  padding-bottom: 48px;
  box-sizing: border-box;
  background: var(--backgroundpaper);
  background-attachment: local;
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

.work-category-heading {
  margin: 0 32px 0 32px;
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

export default {
  components: { DocumentContent },
  data() {
    return {
      closingDocSlug: null,
      categoryGroups: [],
      selectedCategory: "",
      selectedDocument: "",
    };
  },
  computed: {
    // Flat ordered list of all navigable documents on this page
    flatDocList() {
      const docs = [];
      for (const cat of this.categoryGroups) {
        for (const tagGroup of cat.tagGroups) {
          for (const doc of tagGroup.documents) {
            if (!doc.nopage && !docs.find((d) => d.slug === doc.slug)) {
              docs.push({ slug: doc.slug, category: doc.category });
            }
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
    "$route.params": {
      handler(params, oldParams) {
        if (oldParams && oldParams.document && !params.document) {
          this.closingDocSlug = oldParams.document;
        }
        this.selectedCategory = params.slug || "";
        this.selectedDocument = params.document || null;
        if (params.document) {
          if (this.$refs.workPage) this.$refs.workPage.style.overflow = "hidden";
        } else {
          if (this.$refs.workPage) this.$refs.workPage.style.overflow = "";
        }
      },
      immediate: true
    }
  },
  methods: {
    onDocClick(doc, rect) {
      // rect is already stored in Vuex by Carousel's onDocClick
    },
    goToDoc(doc) {
      if (!doc) return;
      const targetIndex = this.flatDocList.findIndex((d) => d.slug === doc.slug);
      const direction = targetIndex > this.currentDocIndex ? 1 : -1;
      const container = this.$refs.modalContainer;
      const newPath = "/work/" + doc.category.slug + "/" + doc.slug + "/";
      
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
          
          // Set flag to avoid double animation and match new category
          this.$store.commit("setInternalNavigation", true);
          
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
      this.$router.push({ 
        path: '/work/' + (this.selectedCategory ? this.selectedCategory + '/' : ''), 
        query: this.$route.query 
      });
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
    this.selectedDocument = this.$route.params.document || "";
    this.selectedCategory = this.$route.params.slug || "";

    if (this.selectedDocument && this.$refs.workPage) {
      this.$refs.workPage.style.overflow = "hidden";
    }
    if (this.$route.hash) {
      const target = document.querySelector(this.$route.hash);
      if (target) {
        this.$refs.workPage.scrollTo({ top: target.offsetTop - 6, behavior: "smooth" });
      }
    }
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
    let title = "";
    let description = "";
    let image = {};
    if (this.selectedCategory && this.$store.state.categories[this.selectedCategory]) {
      title = this.$store.state.categories[this.selectedCategory].name;
      description = this.$store.state.categories[this.selectedCategory].description;
      if (this.$store.state.categories[this.selectedCategory].thumbnailimage) {
        image = {
          hid: "og-image",
          property: "og:image",
          content:
            "https://piersdeseilligny.com" +
            this.$staticAsset(
              this.$config.strapiBaseUri +
              this.$store.state.categories[this.selectedCategory].thumbnailimage.formats.medium.url,
              true
            ),
        };
      }
    }
    if (!title) {
      title = "All work";
      description = "Some of the work I have done as director of photography, camera operator, software developer, graphic designer...";
    }
    return {
      title: `${title} - Piers Deseilligny`,
      meta: [
        { hid: "og-title", property: "og:title", content: title },
        {
          hid: "og-url",
          property: "og:url",
          content: "https://piersdeseilligny.com/work/" + (this.selectedCategory || ""),
        },
        { hid: "og-description", property: "og:description", content: description },
        image,
        { hid: "description", name: "description", content: description },
      ],
    };
  },
  async asyncData(context) {
    const { params, store, $staticAPI, error, route, redirect } = context;
    let selectedCategorySlug = params.slug;
    const selectedDocumentSlug = params.document;

    // Handle context query param for opening modals from the generic "all work" view
    if (route.query.context === 'all') {
      selectedCategorySlug = "";
    }

    // Validate category
    const categoryExists = store.state.categories[selectedCategorySlug];
    if (selectedCategorySlug && !categoryExists) {
      return error({ statusCode: 404, message: "Category not found" });
    }

    try {
      // Build query — filter by category if one is selected
      const docFilter = selectedCategorySlug
        ? `(sort:"order", where:{categories:{slug:"${selectedCategorySlug}"}})`
        : `(sort:"order")`;

      const tagFilter = selectedCategorySlug
        ? `(where:{categories:{slug:"${selectedCategorySlug}"}})`
        : ``;

      const query = `
        query {
          categories(sort:"order") { slug, order, name, description, title, tags { id, name, icon, title, order } },
          tags${tagFilter} { name, id, icon, title, order },
          documents${docFilter} {
            id, title, slug, date, order,
            np_link, backgroundcolor, foregroundcolor, foregroundcolor2,
            nopage,
            category { slug },
            categories { slug },
            tags { name, id, icon, title, order },
            images { formats },
            poster { formats },
            moreinfo { link, header, subheader, outlink { svg, tooltip, name } }
          }
        }
      `;

      const data = await $staticAPI({ query });

      data.documents.sort((a, b) => (a.order > b.order ? -1 : 1));
      data.categories.sort((a, b) => (a.order > b.order ? 1 : -1));

      // Filter categories to only those that have documents
      const relevantCatSlugs = selectedCategorySlug
        ? [selectedCategorySlug]
        : [...new Set(data.documents.map((d) => d.category.slug))];

      const categoryGroups = [];

      for (const catSlug of relevantCatSlugs) {
        const catData = store.state.categories[catSlug] || data.categories.find((c) => c.slug === catSlug);
        if (!catData) continue;

        // Get category object from the query (has tags with order)
        const catFromQuery = data.categories.find((c) => c.slug === catSlug);
        if (!catFromQuery) continue;

        const catTagIds = catFromQuery.tags.map((t) => t.id);

        // Get documents for this category
        let catDocs = data.documents.filter((doc) => {
          if (selectedCategorySlug === catSlug) {
            return doc.categories.some((dc) => dc.slug === catSlug);
          }
          const isPrimary = doc.category.slug === catSlug;
          const isSecondary = doc.categories.some((c) => c.slug === catSlug);
          return isPrimary || isSecondary;
        });

        // Assign maintag + clone
        catDocs = catDocs.map((doc) => {
          const d = { ...doc };
          d.maintag = d.tags.find((t) => catTagIds.includes(t.id)) || { id: 0, order: 9999, name: "Other" };
          d.secondaryCategory = catSlug !== d.category.slug;
          d.category = { ...catFromQuery };
          d.key = `${catSlug}-${d.maintag.id}-${d.slug}`;
          return d;
        });

        // Group by maintag
        const tagMap = {};
        for (const doc of catDocs) {
          const tagId = doc.maintag.id;
          if (!tagMap[tagId]) {
            tagMap[tagId] = { tag: doc.maintag, documents: [] };
          }
          tagMap[tagId].documents.push(doc);
        }

        // Sort tag groups by tag order (high first), and docs within each group
        const tagGroups = Object.values(tagMap).sort(
          (a, b) => (b.tag.order || 0) - (a.tag.order || 0)
        );

        for (const group of tagGroups) {
          group.documents.sort((a, b) => (b.order || 0) - (a.order || 0));
        }

        if (tagGroups.length > 0) {
          categoryGroups.push({
            slug: catSlug,
            name: catData.name || catFromQuery.name,
            title: catData.title || catFromQuery.title,
            description: catData.description || catFromQuery.description,
            tagGroups,
          });
        }
      }

      // Preserve original category ordering
      const orderedSlugs = data.categories.map((c) => c.slug);
      categoryGroups.sort((a, b) => orderedSlugs.indexOf(a.slug) - orderedSlugs.indexOf(b.slug));

      return {
        categoryGroups,
        selectedCategory: selectedCategorySlug || "",
        selectedDocument: selectedDocumentSlug || "",
      };
    } catch (err) {
      return error({ statusCode: 404, message: err.message });
    }
  },
};
</script>