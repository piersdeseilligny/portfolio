<template>
<div class="portfolioVue">
  <transition name="slide-down" appear>
    <transition-group name="tag-list" class="tags" tag="div" v-on:before-leave="beforeDocumentLeave">
      <div v-for="tag in tags" :key="tag.id" class="tag-list-item">
        <Tag :key="tag.id" :name="tag.name" :icon="tag.icon" :selected="tag.selected" :id="tag.id" v-on:selectionchange="tagselectionChange"/>
      </div>
    </transition-group>
  </transition>
    <div class="portfolioContainer">
      <transition name="slide-right" appear>
        <transition-group name="portfolio-list" class="portfolioList" tag="div" v-on:before-leave="beforeDocumentLeave">
        <Document v-for="document in documents" class="portfolio-list-item" 
        :key="document.id" :link="'/portfolio/'+selectedCategory+'/'+document.slug" 
        :title="document.title" 
        :date="document.date"
        :tags="document.tags"
        :images="document.images"
        :selected="document.selected"
        />
        </transition-group>
      </transition>
      <div class="portfolioContent">
        <nuxt :nuxtChildKey="$route.params.document"/>
      </div>
    </div>
</div>
</template>
<style>
    .portfolioVue{
        height:100%;
        width:100%;
        flex-direction: column;
        display:flex;
    }
    .portfolioContainer{
        display:flex;
        align-items:stretch;
    }
    .portfolioContent{
      flex-grow:1;
      min-width:0;

    }
    .portfolioList{
        width:320px;
        min-width: 320px;
        background-color:rgb(26, 27, 30);
        position:relative;
        display:flex;
        flex-direction:column;
    }
    .portfolioList::after{
      content:'';
      position:absolute;
      right:0;
      z-index:0;
      width:2px;
      height:100%;
      background-color: rgba(255,255,255,0.25);
    }
    @media screen and (max-width:800px) {
      .portfolioContainer{
        flex-direction:column;
      }
      .portfolioList{
        width:100%;
        flex-direction: row;
        height:180px;
        overflow-x:scroll;
      }
      .portfolioList .document{
        flex-shrink: 0;
        width:320px;
      }
    }
    .tags{
      padding: 0px 12px;
      background-color: rgb(26, 27, 30);
      box-shadow: 0 0 24px rgba(0,0,0,1);
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      border-bottom:rgba(255, 255, 255, 0.1) solid 1px;
      position:relative;
    }
    .portfolio-list{
      position:relative;
    }
    .portfolio-list-item {
      -webkit-transition: all 0.3s cubic-bezier(0.230, 1.000, 0.320, 1.000);
      transition: all 0.3s cubic-bezier(0.230, 1.000, 0.320, 1.000);
      margin-right: 10px;
    }
    .portfolio-list-enter-active{
      opacity:0;
      transform:translateX(-32px);
    }
    .portfolio-list-enter-to{
      opacity:1;
      transform:translateX(0px);
    }
    .portfolio-list-leave-to {
      opacity: 0;
      transform: translateX(-32px);
    }
    .portfolio-list-leave-active {
      position: absolute !important;
    }

    .tag-list{
      position:relative;
      overflow: hidden;
    }
    .tag-list-item {
      -webkit-transition: all 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000);
      transition: all 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000);
      display:inline-block;
    }
    .tag-list-enter-active{
      opacity:0;
      transform:translateY(-6px);
    }
    .tag-list-enter-to{
      opacity:1;
      transform:translateY(0px);
    }
    .tag-list-leave-to {
      opacity: 0;
      transform: translateY(-6px);
    }
    .tag-list-leave-active {
      position: absolute !important;
    }

    .slide-down-enter-active, .slide-right-enter-active {
      transition: all .5s cubic-bezier(0.230, 1.000, 0.320, 1.000);
    }
    .slide-down-leave-active, .slide-right-leave-active {
      transition: all .5s cubic-bezier(0.230, 1.000, 0.320, 1.000);
    }
    .slide-down-enter, .slide-down-leave-to, .slide-down-leave-active {
      transform: translateY(-32px);
      opacity: 0;
    }
    .slide-right-enter, .slide-right-leave-to, .slide-right-leave-active {
      transform: translateX(-320px);
      opacity: 0;
    }
</style>
<script>
  export default{
    data(){
      return{
        tags:[],
        documents:[],
        selectedCategory:"",
        selectedDocument:""
      }
    },
    watch: {
        '$route.path': function(path) {
            this.selectedDocument = path.split("/")[3];
            for(let i=0; i<this.documents.length; i++){
              if(this.documents[i].slug==this.selectedDocument)
                this.documents[i].selected = true;
              else
                this.documents[i].selected = false;
            }
        }
    },
    methods:{
      beforeDocumentLeave: function(el,done){
        el.style.top=el.offsetTop+"px";
        el.style.left=el.offsetLeft+"px";
      },
      tagselectionChange: async function(id){
        let visibleTags = [];
        for (let i = 0; i < this.tags.length; i++) {
          if(this.tags[i].id==id){
            this.tags[i].selected = !this.tags[i].selected;
          }
          if(this.tags[i].selected)
            visibleTags.push(`"${this.tags[i].id}"`);
        };
        if(!visibleTags.length) visibleTags.push("null");
        const data = await this.$strapi.graphql({
          query:`
          query{
            documents(where:{categories:{slug:"${this.selectedCategory}"},tags:[${visibleTags.join(",")}]}){
              title,
              date,
              id,
              slug,
              tags{
                name,
                icon
              },
              images{
                formats
              }
            }
          }`
        });
        let documents = [];
        for(let i=0; i<data.documents.length; i++){
          const d = data.documents[i];
          if(d.slug==this.selectedDocument)
            d.selected = true;
          else
            d.selected = false;
          documents.push(d);
        }
        this.documents = documents;
      }
    },
    async asyncData (context) {
      try{
        const selectedCategory = context.params.slug;
        const selectedDocument = context.params.document;
        const data = await context.$strapi.graphql({
          query:`
          query {
            tags(where:{categories:{slug:"${selectedCategory}"}}){
              name,
              id,
              icon
            },
            documents(where:{categories:{slug:"${selectedCategory}"}}){
              title,
              date,
              id,
              slug,
              tags{
                name,
                icon
              },
              images{
                formats
              }
            }
          }
          `
        });
        let tags = [];
        for (let i = 0; i < data.tags.length; i++) {
          const t = data.tags[i];
          t.selected = true;
          tags.push(t);
        }
        let documents = [];
        for(let i=0; i<data.documents.length; i++){
          const d = data.documents[i];
          if(d.slug==selectedDocument)
            d.selected = true;
          else
            d.selected = false;
          documents.push(d);
        }
        return{ tags, documents, selectedCategory, selectedDocument }
      }
      catch(err){
        return {
          error: err
        }
      }
    },

  }
</script>