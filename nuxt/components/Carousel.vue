<template>
  <div class="carousel">
    <div :class="['carousel-container', { 'is-transparent': transparent }]">
      <h3 class="carousel-title" v-if="title">
        <span class="carousel-title-icon" v-if="icon" v-html="icon"></span>
        <span>{{ title }}</span>
        <span class="carousel-title-desc" v-if="description">{{ description }}</span>
      </h3>

      <!-- SPLIT-ANCHOR TRACK (Hero + 2-row rail on desktop; Hero above + normal carousel on mobile) -->
      <div
        v-if="isSplitAnchor"
        class="carousel-split-track"
        ref="splitTrack"
        @scroll="checkScroll()"
      >
        <!-- Hero Document Container (Above and static on mobile; first grid column on desktop) -->
        <div class="carousel-split-hero">
          <Document
            ref="heroDoc"
            :hero="true"
            :permanentText="heroPermanentText"
            :doc="heroDoc"
            :link="{
              path: '/work/' + heroDoc.slug + '/',
              query: ($route.path === '/') ? { ...$route.query, context: 'home' } : $route.query,
            }"
            @clickOnDoc="onDocClick"
          />
        </div>

        <!-- Rail Container (Normal carousel on mobile; 2-row rail on desktop) -->
        <div class="carousel-split-rail-container">
          <div
            class="carousel-split-rail"
            ref="splitRail"
            @scroll="checkScroll()"
          >
            <template v-for="doc in railDocs">
              <Document
                v-if="!doc.nopage"
                :key="doc.key || doc.id + 'doc'"
                ref="docs"
                :link="{
                  path: '/work/' + doc.slug + '/',
                  query: ($route.path === '/') ? { ...$route.query, context: 'home' } : $route.query,
                }"
                :doc="doc"
                @clickOnDoc="onDocClick"
              />
              <DocumentNP v-else :key="doc.key || doc.id + 'np'" :doc="doc" />
            </template>
          </div>

          <!-- Mobile navigation buttons scoped to rail carousel -->
          <button
            @click="scroll('left')"
            :disabled="!canScrollLeft"
            aria-label="Scroll left"
            :class="[
              'carousel-btn carousel-btn-prev carousel-split-mobile-btn',
              { cantScroll: !canScrollLeft }
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
            </svg>
          </button>
          <button
            @click="scroll('right')"
            aria-label="Scroll right"
            :disabled="!canScrollRight"
            :class="[
              'carousel-btn carousel-btn-next carousel-split-mobile-btn',
              { cantScroll: !canScrollRight }
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
            </svg>
          </button>
        </div>
      </div>

      <!-- STANDARD SINGLE-ROW TRACK (Home page & single-row categories) -->
      <div v-else class="carousel-track" ref="scrollTrack" @scroll="checkScroll()">
        <template v-for="doc in documents">
          <Document
            v-if="!doc.nopage"
            :key="doc.key || doc.id + 'doc'"
            ref="docs"
            :link="{
              path: '/work/' + doc.slug + '/',
              query: ($route.path === '/') ? { ...$route.query, context: 'home' } : $route.query,
            }"
            :doc="doc"
            @clickOnDoc="onDocClick"
          />
          <DocumentNP v-else :key="doc.key || doc.id + 'np'" :doc="doc" />
        </template>
      </div>

      <!-- Navigation buttons (desktop for split-track, and standard carousel) -->
      <button
        @click="scroll('left')"
        aria-label="Scroll left"
        :disabled="!canScrollLeft"
        :class="[
          'carousel-btn carousel-btn-prev',
          { 'carousel-split-desktop-btn': isSplitAnchor, cantScroll: !canScrollLeft }
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
        </svg>
      </button>
      <button
        @click="scroll('right')"
        aria-label="Scroll right"
        :disabled="!canScrollRight"
        :class="[
          'carousel-btn carousel-btn-next',
          { 'carousel-split-desktop-btn': isSplitAnchor, cantScroll: !canScrollRight }
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style>
.carousel {
  margin-bottom: 0;
}

.carousel-title {
  font-family: var(--font-primary);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
  padding: 8px 32px 4px;
  margin-top: -8px;
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
}

.carousel-title-icon {
  display: inline-flex;
  align-items: center;
}

.carousel-title-icon svg {
  max-width: 14px;
  max-height: 14px;
  fill: currentColor;
}

.carousel-title-desc {
  color: var(--foregroundsubtle);
  font-size: 11px;
  margin-left: 4px;
}

.carousel-container {
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.2);
  background: var(--background1color);
  margin-top: 0;
  position: relative;
}

.carousel-track {
  display: flex;
  padding: 12px 32px 24px 32px;
  overflow-x: scroll;
  scrollbar-width: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-track>a,
.carousel-track>.docnp-container {
  width: 240px;
  flex-shrink: 0;
  height: 120px;
}

.carousel-container .carousel-btn {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 48px;
  z-index: 2;
  border: none;
  cursor: pointer;
  background: transparent;
  transition: opacity 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.carousel-container .carousel-btn.cantScroll {
  opacity: 0;
  pointer-events: none;
}

.carousel-container .carousel-btn svg {
  width: 36px;
  height: 100%;
  top: 0;
  bottom: 0;
  position: absolute;
  color: var(--foregroundhigh);
  right: 12px;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.carousel-container .carousel-btn:hover svg {
  color: white;
  transform: scale(1.1);
}

.carousel-btn-prev.cantScroll svg {
  opacity: 0;
  transform: translateX(12px);
}

.carousel-btn-next.cantScroll svg {
  opacity: 0;
  transform: translateX(-12px);
}

.carousel-btn-prev {
  left: 0;
}

.carousel-btn-prev::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: -160px;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(270deg, transparent, hsl(195, 10%, 8%));
}

.carousel-btn-prev svg {
  right: auto;
  left: 12px;
}

.carousel-btn-next {
  right: 0;
}

.carousel-btn-next::before {
  content: '';
  position: absolute;
  top: 0;
  left: -160px;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, hsl(195, 10%, 8%));
}

.carousel-container.is-transparent,
.work-page .carousel-container {
  box-shadow: none;
  background: transparent;
  padding-top: 0;
}

.carousel-container .carousel-btn svg {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5));
}

.carousel-container .carousel-btn:hover svg {
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.7));
}

.carousel-container.is-transparent .carousel-btn-prev::before,
.work-page .carousel-btn-prev::before {
  background: linear-gradient(
    to left,
    hsla(220, 10%, 10%, 0) 0%,
    hsla(220, 10%, 10%, 0.08) 20%,
    hsla(220, 10%, 10%, 0.28) 40%,
    hsla(220, 10%, 10%, 0.6) 65%,
    hsla(220, 10%, 10%, 0.88) 85%,
    var(--backgroundhigh) 100%
  );
}

.carousel-container.is-transparent .carousel-btn-next::before,
.work-page .carousel-btn-next::before {
  background: linear-gradient(
    to right,
    hsla(220, 10%, 10%, 0) 0%,
    hsla(220, 10%, 10%, 0.08) 20%,
    hsla(220, 10%, 10%, 0.28) 40%,
    hsla(220, 10%, 10%, 0.6) 65%,
    hsla(220, 10%, 10%, 0.88) 85%,
    var(--backgroundhigh) 100%
  );
}

/* ==========================================================================
   SPLIT-ANCHOR TRACK STYLES (Hero + 2-Row Rail in single scrolling track)
   ========================================================================== */
.carousel-split-track {
  display: grid;
  grid-template-rows: repeat(2, 120px);
  grid-auto-flow: column;
  grid-template-columns: 480px;
  grid-auto-columns: 240px;
  gap: 12px;
  overflow-x: scroll;
  scrollbar-width: none;
  padding: 12px 32px 24px 32px;
  box-sizing: border-box;
}

.carousel-split-track::-webkit-scrollbar {
  display: none;
}

/* Desktop: Hero and Rail containers are display: contents so they participate directly in CSS grid */
.carousel-split-hero,
.carousel-split-rail-container,
.carousel-split-rail {
  display: contents;
}

@media (min-width: 601px) {
  .carousel-split-mobile-btn {
    display: none !important;
  }
}

/* First item: Hero spans both rows */
.carousel-split-hero > .document.is-hero,
.carousel-split-track > .document.is-hero {
  grid-row: 1 / span 2;
  grid-column: 1;
  width: 480px;
  height: 252px;
  margin: 0 !important;
  flex-shrink: 0;
}

/* Subsequent items: 2-row rail cards */
.carousel-split-rail > a:not(.is-hero),
.carousel-split-rail > .docnp-container,
.carousel-split-track > a:not(.is-hero),
.carousel-split-track > .docnp-container {
  width: 240px;
  height: 120px;
  margin: 0 !important;
}

/* Responsive queries */
@media (max-width: 800px) {
  .carousel-split-track {
    grid-template-rows: repeat(2, 101px);
    grid-template-columns: 375px;
    grid-auto-columns: 180px;
    gap: 8px;
    padding: 8px 24px 20px 24px;
  }
  .carousel-split-hero > .document.is-hero,
  .carousel-split-track > .document.is-hero {
    width: 375px !important;
    height: 210px !important;
  }
  .carousel-split-rail > a:not(.is-hero),
  .carousel-split-rail > .docnp-container,
  .carousel-split-track > a:not(.is-hero),
  .carousel-split-track > .docnp-container {
    width: 180px !important;
    height: 101px !important;
  }
}

@media (max-width: 600px) {
  .carousel-title {
    padding: 8px 12px 4px;
  }

  .carousel-track {
    padding-left: 12px;
    padding-right: 12px;
  }

  .carousel-btn-prev::before {
    right: -60px;
  }

  .carousel-btn-next::before {
    left: -60px;
  }

  /* Split track on mobile: Hero above (not scrollable), rail as normal carousel below */
  .carousel-split-desktop-btn {
    display: none !important;
  }

  .carousel-split-track {
    display: flex;
    flex-direction: column;
    overflow-x: visible;
    padding: 0;
    gap: 0;
  }

  .carousel-split-hero {
    display: block;
    width: 100%;
    padding: 12px 12px 14px 12px;
    box-sizing: border-box;
  }

  .carousel-split-hero > .document.is-hero {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 16 / 9;
    max-height: 240px;
    margin: 0 !important;
    display: block;
  }

  .carousel-split-rail-container {
    display: block;
    position: relative;
    width: 100%;
    margin-top:-12px;
  }

  .carousel-split-rail {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    scrollbar-width: none;
    padding: 12px 12px 16px 12px;
    gap: 12px;
    box-sizing: border-box;
    margin: 0;
  }

  .carousel-split-rail::-webkit-scrollbar {
    display: none;
  }

  .carousel-split-rail > a:not(.is-hero),
  .carousel-split-rail > .docnp-container {
    width: 240px !important;
    height: 101px !important;
    flex-shrink: 0;
    margin: 0 !important;
  }

  .carousel-split-mobile-btn {
    display: block !important;
  }
}
</style>

<script>
import DocumentNP from "~/components/DocumentNP.vue";
export default {
  components: { DocumentNP },
  props: {
    title: { type: String, default: "" },
    icon: { type: String, default: "" },
    description: { type: String, default: "" },
    documents: { type: Array, default: () => [] },
    transparent: { type: Boolean, default: false },
    splitAnchor: { type: Boolean, default: false },
    heroPermanentText: { type: Boolean, default: true },
  },
  data() {
    return {
      canScrollLeft: false,
      canScrollRight: false,
    };
  },
  computed: {
    isSplitAnchor() {
      return this.splitAnchor && this.documents && this.documents.length >= 2;
    },
    heroDoc() {
      return (this.documents && this.documents.length > 0) ? this.documents[0] : null;
    },
    railDocs() {
      return (this.documents && this.documents.length > 1) ? this.documents.slice(1) : [];
    },
  },
  watch: {
    documents: {
      handler() {
        this.$nextTick(() => {
          this.checkScroll();
          setTimeout(this.checkScroll, 200);
        });
      },
      deep: true,
    },
  },
  methods: {
    getScrollTrack() {
      if (this.isSplitAnchor) {
        if (typeof window !== "undefined" && window.innerWidth <= 600) {
          return this.$refs.splitRail || this.$refs.splitTrack;
        }
        return this.$refs.splitTrack;
      }
      return this.$refs.scrollTrack;
    },
    checkScroll() {
      const el = this.getScrollTrack();
      if (!el) return;
      this.canScrollLeft = el.scrollLeft > 0;
      this.canScrollRight = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth;
    },
    scroll(direction) {
      const el = this.getScrollTrack();
      if (!el) return;
      const scrollAmount = el.clientWidth - 120;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    },
    onDocClick(doc, el) {
      const rect = el.getBoundingClientRect();

      this.$store.commit("setClickedDoc", {
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        id: doc.key || doc.slug,
        el,
      });

      this.$emit("docClick", doc, el);
    },
    /**
     * Scroll a specific document thumbnail into view.
     * Used by the parent to ensure the thumbnail is visible before playing the close animation.
     */
    scrollDocIntoView(docSlug, behavior = "smooth") {
      if (this.isSplitAnchor && this.heroDoc && this.heroDoc.slug === docSlug) {
        const heroEl = this.$refs.heroDoc ? (this.$refs.heroDoc.$el || this.$refs.heroDoc) : null;
        if (heroEl) {
          heroEl.scrollIntoView({ behavior, block: "nearest", inline: "nearest" });
          return heroEl;
        }
      }
      if (!this.$refs.docs) return null;
      const docs = Array.isArray(this.$refs.docs) ? this.$refs.docs : [this.$refs.docs];
      const target = docs.find((d) => d.doc && d.doc.slug === docSlug);
      if (target) {
        target.$el.scrollIntoView({ behavior, block: "nearest", inline: "nearest" });
        return target.$el;
      }
      return null;
    },
  },
  mounted() {
    this.checkScroll();
    this.$nextTick(() => {
      this.checkScroll();
      setTimeout(this.checkScroll, 200);
      setTimeout(this.checkScroll, 500);
    });
    window.addEventListener("resize", this.checkScroll);
  },
  updated() {
    this.checkScroll();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScroll);
  },
};
</script>
