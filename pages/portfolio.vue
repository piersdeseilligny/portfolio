<template>
<div class="portfolioVue">
    <Categories :categories="categories" :selected="selectedCategory"/>
    <nuxt-child v-if="selectedCategory" :key="$route.name"/>
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
        height: 100%;
        align-items:stretch;
        position: relative;
    }
    .portfolioList{
        width:320px;
        background-color:rgba(255, 255, 255, 0.05);
    }
</style>
<script>
  export default {
    data(){
        return{
            categories:[{name:"test"}],
            selectedCategory:"",
            error:{}
        }
    },
    beforeRouteLeave(to,from){
        console.log("TO="+to);
    },
    watch: {
        '$route.path': function(path) {
            console.log(path);
            this.selectedCategory = path.split("/")[2];
        }
    },
    async asyncData (context) {
      try{
        const data = await context.$strapi.graphql({
          query:`
          query {
              categories{
                name,
                id,
                slug
              }
          }
          `
        });
        const categories = data.categories;
        const selectedCategory = context.params.slug; // When calling /abc the slug will be "abc"
        return{ categories, selectedCategory }
      }
      catch(err){
        return {
          error: err
        }
      }
    },
  }
</script>