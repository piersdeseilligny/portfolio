<template>
<div class="portfolioParent">
    <Categories :categories="categories" :selected="selectedCategory"/>
    <nuxt-child v-if="selectedCategory" :key="$route.name"/>
</div>
</template>
<style>
    .portfolioParent{
        position:absolute;
        width:100%;
        height:calc(100% - 172px);
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