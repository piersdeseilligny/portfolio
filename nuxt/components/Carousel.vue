<template>
  <div class="carousel">
    <div class="carousel-container">
      <h3 class="carousel-title" v-if="title">
        <span class="carousel-title-icon" v-if="icon" v-html="icon"></span>
        <span>{{ title }}</span>
        <span class="carousel-title-desc" v-if="description">{{ description }}</span>
      </h3>
      <div class="carousel-track" ref="scrollTrack" @scroll="checkScroll()">
        <template v-for="doc in documents">
          <Document v-if="!doc.nopage" :key="doc.key || doc.id + 'doc'" ref="docs" :link="{
            path: '/work/' + doc.category.slug + '/' + doc.slug + '/',
            query: ($route.path === '/') ? { ...$route.query, context: 'home' } : (!$route.params.slug) ? { ...$route.query, context: 'all' } : $route.query,
          }" :doc="doc" @clickOnDoc="onDocClick" />
          <DocumentNP v-else :key="doc.key || doc.id + 'np'" :doc="doc" />
        </template>
      </div>
      <button @click="scroll('left')" :class="{ 'carousel-btn carousel-btn-prev': true, cantScroll: !canScrollLeft }">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
        </svg>
      </button>
      <button @click="scroll('right')" :class="{ 'carousel-btn carousel-btn-next': true, cantScroll: !canScrollRight }">
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
  padding-top: 8px;
  position: relative;
}

.carousel-track {
  display: flex;
  padding: 12px 24px 24px 24px;
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
  z-index: 1;
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
  },
  data() {
    return {
      canScrollLeft: false,
      canScrollRight: false,
    };
  },
  methods: {
    checkScroll() {
      const el = this.$refs.scrollTrack;
      if (!el) return;
      this.canScrollLeft = el.scrollLeft > 0;
      this.canScrollRight = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth;
    },
    scroll(direction) {
      const el = this.$refs.scrollTrack;
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
    window.addEventListener("resize", this.checkScroll);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScroll);
  },
};
</script>
