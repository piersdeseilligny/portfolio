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
          <br :key="document.key+'flb'" v-if="document.forceLineBreak"/>
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
  box-shadow: 0 0 32px black;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
}
#portfolioContent:not(.visible) {
  transform: translateX(100%);
}
.portfolioList {
  flex-basis: 328px;
  flex-shrink: 0;
  height: calc(100% - var(--headerheight));
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  align-content: flex-start;
  align-items: flex-end;
  padding: 24px;
  padding-top: 32px;
  overflow-y: overlay;
  overflow-x: hidden;
  box-sizing: border-box;
  top: var(--headerheight);
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
.portfolioList > br {
    flex-basis: 100%;
}
.fullscreenlist .portfolioList > br{
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
  font-weight: 200;
  font-family: var(--font-secondary);
  transition: color 0.3s;
}
.animatelink.goback {
  font-family: var(--font-primary);
  font-weight: normal;
  font-size: 12px;
  padding-bottom: 2px;
  position: absolute;
  top: 12px;
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

.fullscreenlist .portfolioList h2 {
  flex-basis: 100%;
}
.fullscreenlist .portfolioList .pContainer {
  flex-basis: 100%;
}
.portfolioList .pContainer p {
  max-width: 722px;
  color: var(--foregroundsubtle);
  font-size: 13px;
  margin-top: 0;
  margin-bottom: 0;
}

.fullscreenlist .portfolioList {
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  flex-basis: auto;
  background-color: transparent;
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
  .portfolioList {
    padding-left: 12px;
    padding-right: 12px;
  }
}
@media screen and (max-width: 800px) {
  .portfolioContainer:not(.fullscreenlist) {
    flex-direction: column;
    top: 0;
    padding-top: var(--headerheight);
  }
  #portfolioContent {
    margin-top: 0px;
  }
  .portfolioContainer:not(.fullscreenlist) .portfolioList {
    width: 100%;
    flex-direction: row;
    flex-basis: 172px;
    overflow-x: overlay;
    overflow-y:hidden;
    margin-top:-12px;
    top: 0px;
    padding: 0px 12px;
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
    border-top: solid 1px rgba(255, 255, 255, 0.4);
  }
  .doccont-scroller {
    overflow-y: unset !important;
  }
  .portfolioList .document.selected {
    transform: translate(0, 16px);
    z-index: 2;
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
<script>
import { gsap } from "gsap";
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
        "$route.path": function (path) {
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
        try {
            const selectedCategory = context.params.slug;
            const selectedDocument = context.params.document;
            let queryString = "";
            let documentselector = `(sort:"order")`;
            let tagselector = "";
            if (selectedCategory && context.store.state.categories[selectedCategory]) {
                documentselector = `(sort:"order", where:{categories:{slug:"${selectedCategory}"}})`;
                tagselector = `(where:{categories:{slug:"${selectedCategory}"}})`;
            }
            else if(selectedCategory && !context.store.state.categories[selectedCategory]){
              context.error({statusCode:404, message:'Category not found'});
            }
            let qstring = `
          query{
            categories{
              slug,
              order,
              tags{
                id
              }
            },
            tags${tagselector}{
              name,
              id,
              icon,
              title
            },
            documents${documentselector}{
              title,
              categories{
                slug
              },
              category{
                slug,
              },
              date,
              id,
              slug,
              np_link,
              backgroundcolor,
              foregroundcolor,
              foregroundcolor2,
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
              order,
              tags{
                name,
                id,
                icon,
                title
              },
              images{
                formats
              },
              poster{
                formats
              },
              nopage
            }
          }
          `;
            const data = await context.$staticAPI({
                query: qstring,
            });
            let documents = [];
            data.documents.sort((a, b) => {
                return a.category.order > b.category.order ? 1 : -1;
            });
            context.store.commit("queryToSelection", context.route.query);
            data.categories.sort((a, b) => {
                return a.order > b.order ? 1 : -1;
            });
            let previousCategory = "";
            let previousMainTag = "";
            let tagCounter = 0;
            for (let i = 0; i < data.categories.length; i++) {
                const c = {...data.categories[i] };
                const tagIds = c.tags.map((t) => t.id);
                console.log("category is " + c.slug);
                //if slug is defined, include everything, otherwise only include those with the main category
                for (let j = 0; j < data.documents.length; j++) {
                    const d = {... data.documents[j] };
                    const categorySlugs = d.categories.map((dc) => dc.slug);
                    let include = false;
                    
                    if(selectedCategory == c.slug){
                      for(let x = 0; x < d.categories.length; x++){
                        if(d.categories[x].slug == c.slug){
                          d.firstcat = d.category.slug != previousCategory;
                          include = true;
                          break;
                        }
                      }
                    }
                    else{
                      if (d.category.slug == c.slug) {
                          include = true;
                          d.firstcat = d.category.slug != previousCategory;
                      }
                      else if(categorySlugs.includes(c.slug)){
                        d.firstcat = c.slug != previousCategory;
                        include = true;
                      }
                    }
                    if (include) {
                        //main tag is whichever one overlaps with those in the current category
                        d.maintag = { id: 0 };
                        for (let x = 0; x < d.tags.length; x++) {
                            if (tagIds.includes(d.tags[x].id)) {
                                //tag overlaps!!
                                d.maintag = d.tags[x];
                                break;
                            }
                        }
                        if (d.slug == selectedDocument)
                            d.selected = true;
                        else
                            d.selected = false;
                        
                        d.firsttag = (c.slug + d.maintag.id) != previousMainTag;

                        //Force the tag to be on a new line if the previous tag group has got more than three items
                        if(d.firsttag){
                          d.forceLineBreak = (tagCounter >= 3);
                          tagCounter = 1;
                        }
                        else{
                          tagCounter++;
                        }
                        
                        
                        d.secondaryCategory = c.slug != d.category.slug;
                        d.category = c;
                        
                        
                        d.key = c.slug+ d.maintag.id + d.slug;
                        previousCategory = c.slug;
                        previousMainTag = c.slug + d.maintag.id;
                        documents.push(d);
                    }
                }
            }
            /*
                  for (let i = 0; i < data.documents.length; i++) {
                    const d = data.documents[i];
                    if (d.slug == selectedDocument) d.selected = true;
                    else d.selected = false;
                    d.firstslug = d.category.slug != previousCategory;
            
                    
                    previousCategory = d.category.slug;
                    d.tagTable = {};
                    for (let tag of d.tags) {
                      d.tagTable[tag.name] = true;
                    }
            
                    documents.push(d);
                  }*/
            console.log(documents);
            return {
                tags: data.tags,
                documents,
                selectedCategory,
                selectedDocument,
            };
        }
        catch (err) {
          context.error({statusCode:404, message:err.message});
            return {
                error: err,
            };
        }
    },
    components: { DocumentNP }
};
</script>
