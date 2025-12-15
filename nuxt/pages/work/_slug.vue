<template>
  <div class="portfolioVue">
    <transition
      name="slide-down"
      appear
      v-on:enter="tagsAppear"
      v-on:before-leave="tagsHideBefore"
      v-on:after-leave="tagsHideAfter"
    >
    </transition>
    <div
      :class="{
        portfolioContainer: true,
        fullscreenlist: $route.params.document == undefined,
        withinportfolio: $route.params.document != undefined,
      }"
    >
      <transition-group
        name="portfolio-list"
        class="portfolioList"
        tag="div"
        v-on:before-leave="beforeDocumentLeave"
      >
        <template v-for="document in documents">
          <div
            class="category-header"
            v-if="document.firstcat"
            :key="document.category.slug"
          >

            <nuxt-link
              v-if="selectedCategory"
              class="animatelink goback"
              :to="{
                path: '/work/',
                query: $route.query,
              }"
              :key="document.category.slug + '_b'"
            >

              <svg>
                <polygon
                  points="13.1,5.8 2.2,5.8 7.3,1.2 6.7,0.5 0.2,6.3 6.7,12 7.3,11.3 2.2,6.8 13.1,6.8 "
                /></svg>View all</nuxt-link
            >
            <h2 :key="document.category.slug+'h2'" v-if="document.firstcat" :class="{lined:true, hideline:selectedCategory}">
              <nuxt-link
                :id="document.category.slug"
                class="animatelink"
                :title="$store.state.categories[document.category.slug].title"
                :to="{
                  path: '/work/' + document.category.slug + '/',
                  query: $route.query,
                }"
                ><span>{{
                  $store.state.categories[document.category.slug].name
                }}</span></nuxt-link
              >
            </h2>
            <div v-if="document.firstcat" class="pContainer fancy" :key="document.category.slug + '_d'" v-html="$md.render($store.state.categories[document.category.slug].description)">
            </div>
          </div>
          <div :key="document.key+'flb'" class="portfolio-list-break" v-if="document.forceLineBreak"></div>
          <div class="portfolio-list-item-container" :key="document.key+'container'">
              <transition-group
              :key="document.key+'tag'"
                v-if="document.firsttag && document.maintag && document.maintag.name"
                name="tag-list"
                :class="'tags'"
                tag="div"
                style="z-index: 1"
                v-on:before-leave="beforeDocumentLeave"
              >
                  <Tag
                    :key="document.key+'tag2'"
                    :name="document.maintag.name"
                    :title="document.maintag.title"
                    :icon="document.maintag.icon"
                    :category="document.category.slug"
                    :id="document.maintag.id"
                  />
              </transition-group>
          <!--<h2 :key="document.id+'_h2'" v-if="document.category.name != documentLoopCategory && (documentLoopCategory = document.category.name)">document.category.name</h2>
          --><Document
            :class="{
              'portfolio-list-item': true,
              filteredout: document.hidden,
            }"
            v-if="document.order != -1 && !document.nopage"
            :key="document.key+'doc'"
            ref="docs"
            :link="{
              path: '/work/' + document.category.slug + '/' + document.slug+'/',
              query: $route.query,
            }"
            :doc="document"
            @clickOnDoc="clickOnDoc"
          />
          <DocumentNP v-if="document.nopage" :doc="document" :key="document.id"></DocumentNP>
        </div>
        </template>
      </transition-group>
      <div
        id="portfolioContent"
        ref="portfolioContent"
        :class="{ visible: $route.params.document }"
      >
        <nuxt :nuxtChildKey="$route.params.document" />
      </div>
    </div>
  </div>
</template>
<style>
.goback-enter-active {
  opacity: 0;
  transform: translateX(-32px);
}
.goback-enter-to {
  opacity: 1;
  transform: translateX(0px);
}
.goback-leave-to {
  opacity: 0;
  transform: translateX(-32px);
}


.portfolioVue {
  flex-basis: 1;
  flex-grow: 1;
  width: 100%;
  height: calc(100% - 46px);
  flex-direction: column;
  display: flex;
}
.portfolioContainer {
  display: flex;
  align-items: stretch;
  max-width: var(--maxwidth);
  height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
  margin: 0 auto;
  background: var(--background1);
  overflow-x: hidden;
}
#portfolioContent {
  flex-grow: 1;
  min-width: 0;
  z-index: 3;
  box-shadow: 0 0 18px black;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
}
#portfolioContent:not(.visible) {
  transform: translateX(100%);
}
.portfolioList {
  flex-basis: 328px;
  flex-shrink: 0;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  align-content: flex-start;
  align-items: flex-end;
  overflow-y: overlay;
  overflow-x: hidden;
  box-sizing: border-box;
  padding-top:calc(var(--headerheight) + 16px);
  padding-right:8px;
  padding-left:20px;
  background: var(--backgroundpaper);
  background-attachment: local;
}
.portfolioList > * {
  flex-shrink: 0;
}
.fullscreenlist .category-header {
  margin-top: 24px;
  margin-bottom:6px;
  width: 100%;
}
.portfolioList .category-header:first-child {
  margin-top: 0;
}
.fullscreenlist .portfolioList > .portfolio-list-break{
  flex-basis: 100%;
  content: '';
}
.portfolio-list-item-container{
    /*width: 276px;*/
    min-height: 138px;
    position: relative;
    display: flex;
    flex-direction: column;
    flex-basis: 33%;
}
@media screen and (max-width: 800px) {
  .portfolio-list-item-container{
    /*width:213px !important;*/
    min-height: 101px !important;
    flex-basis: 50%;
  }
}
.withinportfolio .portfolio-list-item-container{
  flex-basis:content;
}
.animatelink {
  color: var(--foregroundlink);
  position: relative;
  text-decoration: none;
  font-size: 1.5em;
  font-family: var(--font-secondary);
  transition: color 0.3s;
}
.animatelink.goback {
  font-family: var(--font-primary);
  font-weight: normal;
  font-size: 12px;
  padding-bottom: 2px;
  position: absolute;
  top: calc(var(--headerheight) + 12px)
}
.animatelink.goback svg {
  height: 16px;
  width: 16px;
  fill: currentColor;
  margin-bottom: -4px;
  margin-right: 2px;
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
.portfolioList h2{
  margin-top:0;
  transition: margin-top 0.2s;
}
.fullscreenlist .portfolioList h2 {
  flex-basis: 100%;
}
.portfolioList h2.hideline {
  margin-top:12px;
}
.fullscreenlist .portfolioList .pContainer {
  flex-basis: 100%;
}
.portfolioList .pContainer p {
  max-width: 722px;
  color: var(--foregroundsubtle);
  margin-top: 0;
  margin-bottom: 0;
  margin-right:0;
}

.fullscreenlist .portfolioList {
  width: 100%;
  padding-right:8px;
  padding-bottom:24px;
  padding-left:32px;
  flex-direction: row;
  flex-wrap: wrap;
  flex-basis: auto;
}


.fullscreenlist .portfolioList::after {
  display: none;
}
.tagscontainer {
  position: relative;
  width: -moz-fit-content;
  width: fit-content;
  transform: width 0.2s ease;
  margin-left: -6px;
  line-height: 16px;
  margin-top: 4px;
}
.fullscreenlist .tags{
    flex-basis: 100%;
}
.tags {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  max-width: var(--maxwidth);
  margin: 0 auto;
  width: 0px;
  margin-left:0px;
  margin-top:12px;
  margin-bottom:-6px;
}
.portfolio-list {
  position: relative;
}
.portfolio-list-item {
  -webkit-transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.portfolio-list-item.filteredout {
  display: none;
}
.portfolio-list-enter-active {
  opacity: 0;
  transform: translateX(-32px);
}
.portfolio-list-enter-to {
  opacity: 1;
  transform: translateX(0px);
}
.portfolio-list-leave-to {
  opacity: 0;
  transform: translateX(-32px);
}
.portfolio-list-leave-active {
  position: absolute !important;
}

.tag-list {
  position: relative;
  overflow: hidden;
}
.tag-list-item {
  -webkit-transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  display: inline-block;
}
.tag-list-enter-active {
  opacity: 0;
  transform: translateY(-6px);
}
.tag-list-enter-to {
  opacity: 1;
  transform: translateY(0px);
}
.tag-list-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.tag-list-leave-active {
  position: absolute !important;
}

.slide-down-enter-active,
.slide-right-enter-active {
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}
.slide-down-leave-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}
.slide-down-enter,
.slide-down-leave-to,
.slide-down-leave-active {
  transform: translateY(-32px);
  opacity: 0;
}
.slide-right-enter,
.slide-right-leave-to,
.slide-right-leave-active {
  transform: translateX(-320px);
  opacity: 0;
}
@media screen and (max-width: 498px) {
  .portfolioContainer.fullscreenlist .document {
    width: calc(100vw - 24px) !important;
  }
  .fullscreenlist .portfolioList {
    padding-right: 12px;
    padding-left:12px;
  }
}
@media screen and (max-width: 800px) {
  .portfolioContainer:not(.fullscreenlist) {
    flex-direction: column;
    top: 0;
  }
  #portfolioContent {
    margin-top: 0px;
  }
  .portfolioContainer:not(.fullscreenlist) .portfolioList {
    width: 100%;
    flex-direction: row;
    flex-basis: 158px;
    overflow-x: overlay;
    overflow-y:hidden;
    top: 0px;
    padding: 0px 12px 12px 12px;
    flex-wrap: nowrap;
  }
  .portfolioContainer:not(.fullscreenlist) .category-header {
    display: none;
  }
  /*.portfolioList .document {
    flex-shrink: 0;
    width: 320px;
  }*/
  .doccont-container {
    border-left: none;
    border-top: solid 1px rgba(255, 255, 255, 0.1);
  }
  .doccont-scroller {
    overflow-y: unset !important;
    background: url(/noisetexture.png);
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
<script>
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);
import DocumentNP from "~/components/DocumentNP.vue";
let cntrlIsPressed = false;
export default {
    data() {
        return {
            documents: [],
            selectedCategory: "",
            selectedDocument: "",
            tagContainerHeight: 0,
            clickedElement: null,
        };
    },
    watch: {
        "$route.path": async function (path) {

            this.selectedDocument = this.$route.params.document;
            this.selectedCategory = this.$route.params.slug;
            for (let i = 0; i < this.documents.length; i++) {
                if (this.documents[i].slug == this.selectedDocument)
                    this.documents[i].selected = true;
                else
                    this.documents[i].selected = false;
            }

        },
        "$route.params.document": function () {
            //animate transition from column to row
            setTimeout(() => {
                this.scrollToSelection();
            }, 100);
        },
        "$route.query": function () {
            this.filterDocuments();
        },
    },
    methods: {
        tagsAppear: function () {
            this.tagContainerHeight = this.$refs.tagContainer
                ? this.$refs.tagContainer.clientHeight
                : 0;
        },
        tagsHideBefore: function () {
            // gsap.to(".portfolioContainer", {duration: 2, y:-32})
        },
        tagsHideAfter: function () {
            // gsap.to(".portfolioContainer", {duration: 0, y:0})
        },
        beforeDocumentLeave: function (el, done) {
            el.style.top = el.offsetTop + "px";
            el.style.left = el.offsetLeft + "px";
        },
        async filterDocuments(docs) {
            for (let document of this.documents) {
                if (this.$store.state.selectedTags[document.category.slug]["All"]) {
                    document.hidden = false;
                    continue; //All should be visible, continue
                }
                else {
                    let filteredTags = this.$store.state.selectedTags[document.category.slug];
                    for (let tag of Object.keys(filteredTags)) {
                        let visible = filteredTags[tag];
                        if (document.tagTable[tag] && visible) {
                            document.hidden = false;
                            break;
                        }
                        else {
                            document.hidden = true;
                        }
                    }
                }
            }
        },
        tagselectionChange: async function (category, tag, ctrlclick) {
            this.$store.commit("selectTag", {
                category: category,
                tag: tag,
                deselect: !ctrlclick,
            });
            this.updateQuery();
        },
        toggleSelectedAll: function (category) {
            this.$store.commit("selectAllTags", { category: category });
            this.updateQuery();
        },
        updateQuery: function () {
            let newquery = this.$store.getters["queryString"];
            this.$router.replace({
                path: this.$route.path,
                query: newquery,
            });
        },
        resizeTagContainer: function ({ width, height }) {
            this.tagContainerHeight = height;
        },
        clickOnDoc: function (doc, el) {
            this.$refs.portfolioContent.style.backgroundColor = doc.backgroundcolor;
        },
        scrollToSelection: function () {
            if (this.$refs.docs) {
                if (Array.isArray(this.$refs.docs)) {
                    this.$refs.docs.forEach((el, i) => {
                        if (el.doc && el.doc.selected) {
                            el.$el.scrollIntoView({
                                behavior: "smooth",
                                block: "nearest",
                                inline: "nearest",
                            });
                        }
                    });
                }
                else if (this.$refs.docs.doc && this.$refs.docs.doc.selected) {
                    this.$refs.docs.$el.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "nearest",
                    });
                }
            }
        },
    },
    mounted() {
        this.scrollToSelection();
        if (this.$route.hash) {
            if (document.querySelector(this.$route.hash)) {
                document.querySelector(".portfolioList").scrollTo({ top: document.querySelector(this.$route.hash).offsetTop - 6, behavior: "smooth" });
            }
        }
    },
    head() {
        let title = "";
        let description = "";
        let image = {};
        if (this.selectedCategory && this.$store.state.categories[this.selectedCategory]) {
            title = this.$store.state.categories[this.selectedCategory].name;
            description = this.$store.state.categories[this.selectedCategory].description;
            image = {
                hid: "og-image",
                property: "og:image",
                content: "https://piersdeseilligny.com" + this.$staticAsset(this.$config.strapiBaseUri + this.$store.state.categories[this.selectedCategory].thumbnailimage.formats.medium.url, true)
            };
        }
        if (!title) {
            title = "All work";
            description = "Some of the work I have done as director of photography, camera operator, software developper, graphic designer...";
        }
        return {
            title: `${title} - Piers Deseilligny`,
            meta: [
                { hid: "og-title", property: "og:title", content: title },
                {
                    hid: "og-url",
                    property: "og:url",
                    content: "https://piersdeseilligny.com/work/" +
                        (this.selectedCategory ? this.selectedCategory : ""),
                },
                {
                    hid: "og-description",
                    property: "og:description",
                    content: description,
                },
                image,
                { hid: "description", name: "description", content: description },
            ],
        };
    },
  async asyncData(context) {
    const { params, store, $staticAPI, error, route } = context;
    const selectedCategorySlug = params.slug;
    const selectedDocumentSlug = params.document;

    // --- 1. Validation ---
    // If a category is requested but doesn't exist in the store, 404 immediately.
    const categoryExists = store.state.categories[selectedCategorySlug];
    if (selectedCategorySlug && !categoryExists) {
      return error({ statusCode: 404, message: 'Category not found' });
    }

    try {
      // --- 2. Build Query ---
      // We conditionally create the filter strings here for readability
      const docFilter = selectedCategorySlug
        ? `(sort:"order", where:{categories:{slug:"${selectedCategorySlug}"}})`
        : `(sort:"order")`;

      const tagFilter = selectedCategorySlug
        ? `(where:{categories:{slug:"${selectedCategorySlug}"}})`
        : ``;

      const query = `
        query {
          categories { slug, order, tags { id } },
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

      // --- 3. Fetch Data ---
      const data = await $staticAPI({ query });

      // Sort raw data immediately
      data.documents.sort((a, b) => (a.category.order > b.category.order ? 1 : -1));
      data.categories.sort((a, b) => (a.order > b.order ? 1 : -1));

      // Update Store
      store.commit("queryToSelection", route.query);

      // --- 4. Transformation (The "Matrix" Logic) ---
      // We want a list of documents, but grouped by Category. 
      // A document appears multiple times if it belongs to multiple categories.
      
      
      // We iterate categories, finding documents that belong to them
  // --- 4. Transformation (The "Matrix" Logic) ---
      let processedDocuments = [];

      processedDocuments = data.categories.flatMap((cat) => {
        const catTagIds = cat.tags.map((t) => t.id);

        // A. Filter documents relevant to this category
        let categoryDocs = data.documents.filter((doc) => {
          if (selectedCategorySlug === cat.slug) {
            return doc.categories.some((dc) => dc.slug === cat.slug);
          }
          const isPrimary = doc.category.slug === cat.slug;
          const isSecondary = doc.categories.some((c) => c.slug === cat.slug);
          return isPrimary || isSecondary;
        });

        // B. Pre-process: Attach "maintag" and clone the object
        // We do this BEFORE sorting so we have the data we need to sort with.
        categoryDocs = categoryDocs.map((doc) => {
          const d = { ...doc };
          
          // Find the tag that matches the current category context
          // If no tag matches (rare), provide a fallback object with high order so it goes to the bottom
          d.maintag = d.tags.find((t) => catTagIds.includes(t.id)) || { id: 0, order: 9999 };
          
          return d;
        });

        // C. Sort: Group by Tag Order, then ensure Grouping Stability
        categoryDocs.sort((a, b) => {
          // 1. Primary Sort: Tag Order (High numbers first)
          // We use (b - a) to put the highest 'order' tags at the top
          const tagOrderDiff = (b.maintag.order || 0) - (a.maintag.order || 0);
          if (tagOrderDiff !== 0) return tagOrderDiff;

          // 2. Secondary Sort: Tag ID (Guarantees grouping if orders are identical)
          const idDiff = a.maintag.id - b.maintag.id;
          if (idDiff !== 0) return idDiff;

          // 3. Tertiary Sort: Document Order (High numbers first)
          // We use (b - a) here too so documents with higher 'order' are at the top
          return (b.order || 0) - (a.order || 0);
        });

        // D. Final Map: Apply Contextual Flags
        return categoryDocs.map((d) => {
          d.selected = d.slug === selectedDocumentSlug;
          d.secondaryCategory = cat.slug !== d.category.slug;
          
          // Ensure the doc knows which category group it's currently sitting in
          d.category = { ...cat }; 
          d.key = `${cat.slug}-${d.maintag.id}-${d.slug}`;

          return d;
        });
      });

      // --- 5. Layout Calculation Pass ---
      // Now that we have a flat list, we calculate visual relationship flags
      // (headers, line breaks) based on the *previous* item in the list.
      
      let prevCatSlug = "";
      let prevMainTagId = "";
      let tagGroupCount = 0;

      processedDocuments.forEach((d) => {
        const currentMainTagId = d.category.slug + d.maintag.id;

        // Is this the start of a new Category Section?
        d.firstcat = (d.category.slug !== prevCatSlug);

        // Is this the start of a new Tag Group?
        d.firsttag = (currentMainTagId !== prevMainTagId);

        // Logic: Force a line break if the PREVIOUS tag group had >= 3 items
        if (d.firsttag) {
          d.forceLineBreak = (tagGroupCount >= 3);
          tagGroupCount = 1; // Reset counter for new group
        } else {
          tagGroupCount++;
        }

        // Update trackers for next iteration
        prevCatSlug = d.category.slug;
        prevMainTagId = currentMainTagId;
      });

      return {
        tags: data.tags,
        documents: processedDocuments,
        selectedCategory: selectedCategorySlug,
        selectedDocument: selectedDocumentSlug,
      };

    } catch (err) {
      return error({ statusCode: 404, message: err.message });
    }
  },
    components: { DocumentNP }
};
</script>
