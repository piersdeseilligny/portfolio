<template>
  <div class="portfolioVue">
    <transition name="slide-down" appear v-on:enter="tagsAppear" v-on:before-leave="tagsHideBefore" v-on:after-leave="tagsHideAfter">
      <div ref="tagContainer" class="tagscontainer"  v-if="tags && tags.length" v-resize="resizeTagContainer">
      <transition-group
        name="tag-list"
        :class="'tags'"
        tag="div"
        style="z-index:1"
        v-on:before-leave="beforeDocumentLeave"
      >
        <div key="all" class="tag-list-item">
          <Tag
            key="all"
            name="All"
            :selected="selectedall"
            id="all"
            v-on:selectionchange="toggleSelectedAll"
          />
        </div>
        <div v-for="tag in tags" :key="tag.id" class="tag-list-item">
          <Tag
            :key="tag.id"
            :name="tag.name"
            :icon="tag.icon"
            :selected="selectedall ? false : tag.selected"
            :id="tag.id"
            v-on:selectionchange="tagselectionChange"
          />
        </div>
      </transition-group>
      </div>
    </transition>
    <div :class="{'portfolioContainer':true,'fullscreenlist':($route.params.document==undefined)}">
        <transition-group
          :style="`margin-top:${tagContainerHeight}px`"
          name="portfolio-list"
          class="portfolioList"
          tag="div"
          v-on:before-leave="beforeDocumentLeave"
        >
        <template v-for="document in documents">
          <template v-if="document.first">
            <h2 v-if="!selectedCategory" :key="document.category.slug" >{{$parent.$data.categoryStore[document.category.slug].name}}</h2>
            <div class="pContainer" :key="document.category.slug + '_d'">
              <p>{{$parent.$data.categoryStore[document.category.slug].description}}</p>
            </div>
          </template>
          <!--<h2 :key="document.id+'_h2'" v-if="document.category.name != documentLoopCategory && (documentLoopCategory = document.category.name)">document.category.name</h2>
          --><Document
            :class="{'portfolio-list-item':true, 'filteredout':document.hidden}"
            :key="document.id"
            :link="'/work/' + document.category.slug + '/' + document.slug + queryString"
            :doc="document"
          />
          </template>
        </transition-group>
      <div id="portfolioContent">
        <nuxt :nuxtChildKey="$route.params.document" />
      </div>
    </div>
  </div>
</template>
<style>
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
  width:100%;
  margin: 0 auto;
  background: var(--background1);
}
#portfolioContent {
  flex-grow: 1;
  min-width: 0;
}
.fullscreenlist #portfolioContent{
  display:none;
}
.portfolioList {
  flex-basis: 368px;
  flex-shrink: 0;
  height: calc(100% - var(--headerheight) - var(--subheaderheight));
  position: relative;
  display: flex;
  flex-direction: column;
  transition:all 0.2s;
  align-content: flex-start;
  padding:24px;
  overflow-y:overlay;
  overflow-x:hidden;
  box-sizing: border-box;
  top: calc(var(--headerheight) + var(--subheaderheight));
}
.portfolioList > *{
  flex-shrink: 0;
}
.portfolioList h2{
    margin-top: 12px;
    font-size: 18px;
    font-weight: 400;
    color: var(--foreground2);
}
.fullscreenlist .portfolioList h2{
  flex-basis:100%;
}
.portfolioList h2:first-child{
  margin-top:0px;
}
.fullscreenlist .portfolioList .pContainer{
  flex-basis:100%;
}
.portfolioList .pContainer p{
  max-width:512px;
  color:var(--foreground);
  font-size:13px;
  margin-top:0;
  margin-bottom:0;
}
.fullscreenlist .portfolioList{
  width:100%;
  flex-direction: row;
  flex-wrap: wrap;
  flex-basis:auto;
  background-color:transparent;
}

.fullscreenlist .portfolioList::after{
  display: none;
}
.tagscontainer{
    transform: translateY(-1px);
    padding: 0px 12px;
    background: var( --background2);
    box-shadow: 0 0 24px rgba(0, 0, 0, 1);
    border: rgba(255, 255, 255, 0.1) solid 1px;
    position: relative;
    top: calc(var( --headerheight));
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    max-width:400px;
    z-index: 1;
    transform: width 0.2s ease;
}
.tags {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  max-width: var(--maxwidth);
  margin: 0 auto;
}
.portfolio-list {
  position: relative;
}
.portfolio-list-item {
  -webkit-transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.portfolio-list-item.filteredout{
  display:none;
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
  .portfolioContainer.fullscreenlist .document{
    width:100% !important;
  }
  .portfolioList {
    padding: 12px;
  }
}
@media screen and (max-width: 800px) {
  .portfolioContainer:not(.fullscreenlist) {
    flex-direction: column;
    top:72px;
  }
  #portfolioContent{
    margin-top:32px;
  }
  .portfolioContainer:not(.fullscreenlist) .portfolioList {
    width: 100%;
    flex-direction: row;
    flex-basis:128px;
    overflow-x: overlay;
    top:32px;
    padding:0px 12px;
    flex-wrap: nowrap;
  }
  .portfolioContainer:not(.fullscreenlist) .portfolioList h2{
    display:none;
  }
  .portfolioContainer:not(.fullscreenlist) .portfolioList p{
    display:none;
  }
  .portfolioList .document {
    flex-shrink: 0;
    width: 320px;

  }
  .portfolioList .document.selected {
    transform:translate(0, 12px);
  }
}

</style>
<script>
import { gsap } from "gsap";
let cntrlIsPressed = false;
export default {
  data() {
    return {
      tags: [{name:"hello", id:0}],
      documents: [],
      selectedCategory: "",
      selectedDocument: "",
      selectedall: true,
      queryString: "",
      tagContainerHeight:0
    };
  },
  watch: {
    "$route.path": function (path) {
      this.selectedDocument = this.$route.params.document;
      this.selectedCategory = this.$route.params.slug;
      for (let i = 0; i < this.documents.length; i++) {
        if (this.documents[i].slug == this.selectedDocument)
          this.documents[i].selected = true;
        else this.documents[i].selected = false;
      }
    },
    "$route.params.document":function(){
      //animate transition from column to row
    },
    "$route.query": function () {
      this.filterDocuments();
    },
  },
  methods: {
    tagsAppear: function(){
      this.tagContainerHeight = this.$refs.tagContainer ? this.$refs.tagContainer.clientHeight : 0;
    },
    tagsHideBefore: function(){
     // gsap.to(".portfolioContainer", {duration: 2, y:-32})
    },
    tagsHideAfter: function(){
     // gsap.to(".portfolioContainer", {duration: 0, y:0})
    },
    toggleSelectedAll: function () {
      this.selectedall = !this.selectedall;
      if(this.selectedall){
        this.$router.replace({ path: this.$route.path, query: null });
        this.filterDocuments();
      }
    },
    beforeDocumentLeave: function (el, done) {
      el.style.top = el.offsetTop + "px";
      el.style.left = el.offsetLeft + "px";
    },
    async filterDocuments() {
      let visibleTags = [];
      if(this.$route.query.s){
        visibleTags = this.$route.query.s.split(",");
        for (let i = 0; i < this.tags.length; i++) {
          this.tags[i].selected = visibleTags.includes(this.tags[i].id.toString());
        }
        this.queryString = "?s="+this.$route.query.s;
      }
      else{
        this.queryString = "";
      }


      for (let i = 0; i < this.documents.length; i++) {
        let hidden = true;
        if(visibleTags && visibleTags.length && visibleTags.length>0){
          for (let j = 0; j < this.documents[i].tags.length; j++) {
            console.log("id="+this.documents[i].tags[j].id.toString());
            console.log(visibleTags);
            if(visibleTags.includes(this.documents[i].tags[j].id.toString())){
              hidden = false;
            }
          }
        }
        else{
          hidden = false;
        }
        this.documents[i].hidden = hidden;

      }
      /*
      let tagQuery = `,tags:[${visibleTags.join(",")}]`;
      let documentselector = "";
      if(this.selectedCategory){
        documentselector=`(where:{categories:{slug:"${this.selectedCategory}"}${tagQuery}})`;
      }
      if (selectedall) tagQuery = "";
      const data = await this.$strapi.graphql({
        query: `
          query{
            documents${documentselector}{
              title,
              categories{
                slug
              },
              category{
                slug
              },
              date,
              id,
              slug,
              backgroundcolor,
              foregroundcolor,
              foregroundcolor2
              tags{
                name,
                icon
              },
              images{
                formats
              }
            }
          }`,
      });
      let documents = [];
      for (let i = 0; i < data.documents.length; i++) {
        const d = data.documents[i];
        if (d.slug == this.selectedDocument) d.selected = true;
        else d.selected = false;
        documents.push(d);
      }
      this.documents = documents;*/
    },
    tagselectionChange: async function (id, ctrlclick) {
      let visibleTags = [];
      let visibleTagsRawIds = [];
      for (let i = 0; i < this.tags.length; i++) {
        if (this.selectedall || !ctrlclick) {
          if (this.tags[i].id == id) {
            this.tags[i].selected = true;
          } else {
            this.tags[i].selected = false;
          }
        } else if (this.tags[i].id == id) {
          this.tags[i].selected = !this.tags[i].selected;
        }
        if (this.tags[i].selected) {
          visibleTags.push(`"${this.tags[i].id}"`);
          visibleTagsRawIds.push(this.tags[i].id);
        }
      }
      if (visibleTagsRawIds.length != this.tags.length && visibleTagsRawIds.length>0) {
        //less selected tags than there are total, change route to selection
        this.$router.replace({
          path: this.$route.path,
          query: { s: visibleTagsRawIds.join(",") },
        });
        if (this.selectedall) this.selectedall = false;
      } else {
        this.$router.replace({ path: this.$route.path, query: null });
        this.selectedall = true;
      }
      if (!visibleTags.length) visibleTags.push("null");
      if (visibleTags.length == this.tags.length) this.selectedall = true;
      await this.filterDocuments();
    },
    resizeTagContainer: function({width, height}){
     this.tagContainerHeight = height;
    }
  },
  mounted(){
    this.tagContainerHeight = this.$refs.tagContainer ? this.$refs.tagContainer.clientHeight : 0;
    this.filterDocuments();
  },
  head() {
    let title="";
    let description="";
    if(this.selectedCategory){
      title = this.$parent.$data.categoryStore[this.selectedCategory].name;
      description = this.$parent.$data.categoryStore[this.selectedCategory].description;
    }
    if(!title){
      title="All work";
      description=`All my work in ${this.$parent.$data.categories.map((v)=>{ return v.name; }).join(', ')}`;
    }
      return {
        title: `${title} - Piers Deseilligny`,
        meta:[
          { hid:'og-title', property:'og:title', content:title },
          { hid:'og-url', property:'og:url', content:"https://piersdeseilligny.com/work/"+(this.selectedCategory ? this.selectedCategory : "")},
          { hid:'og-description', property:'og:description', content:description },
          { hid:'description', property:'description', content:description }
        ]
    }
  },
  async asyncData(context) {
    try {
      const selectedCategory = context.params.slug;
      const selectedDocument = context.params.document;
      let queryString = "";
      let tagQuery = "";
      let selectedTags = [];
      if (context.query.s) {
        queryString = "?s=" + context.query.s;
        selectedTags = context.query.s.split(",");
        let visibleTags = [];
        if (selectedTags.length) {
          visibleTags = context.query.s.split(",").map(function (e) {
            return '"' + e + '"';
          });
        }
        tagQuery = ",tags:[" + visibleTags.join(",") + "]";
      }
      let documentselector = `(sort:"order")`;
      let tagselector = "";
      if(selectedCategory){
        documentselector=`(sort:"order", where:{categories:{slug:"${selectedCategory}"}${tagQuery}})`;
        tagselector=`(where:{categories:{slug:"${selectedCategory}"}})`;
      }
      let qstring = `
          query{
            tags${tagselector}{
              name,
              id,
              icon
            },
            documents${documentselector}{
              title,
              categories{
                slug
              },
              category{
                slug,
                order
              },
              date,
              id,
              slug,
              backgroundcolor,
              foregroundcolor,
              foregroundcolor2,
              tags{
                name,
                id,
                icon
              },
              images{
                formats
              }
            }
          }
          `;

      console.log(qstring);
      const data = await context.$staticAPI({
        query: qstring,
      });
      let tags = [];
      if(selectedCategory){
        for (let i = 0; i < data.tags.length; i++) {
          const t = data.tags[i];
          if (selectedTags != undefined && selectedTags.length) {
            t.selected = selectedTags.includes(t.id);
          } else {
            t.selected = false;
          }
          tags.push(t);
        }
      }
      let documents = [];
      let firstOfCategory = true;
      let previousCategory = "";
      data.documents.sort((a,b)=>{
        /*if (a.category === b.city) {
         // Price is only important when cities are the same
          return b. - a.price;
        }*/
        return a.category.order > b.category.order ? 1 : -1;
      })
      for (let i = 0; i < data.documents.length; i++) {
        const d = data.documents[i];
        if (d.slug == selectedDocument) d.selected = true;
        else d.selected = false;
        d.first = (d.category.slug != previousCategory);
        previousCategory = d.category.slug;
        documents.push(d);
      }
      return {
        tags,
        documents,
        selectedCategory,
        selectedDocument,
        queryString,
        selectedall:(selectedTags==undefined || !selectedTags.length)
      };
    } catch (err) {
      return {
        error: err,
      };
    }
  },
};
</script>
