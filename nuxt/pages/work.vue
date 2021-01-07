<template>
<div class="portfolioParent">
    <!--<Categories :categories="categories" :selected="selectedCategory" @select="function(e){ selectedCategory=e.slug; selectedCategoryName=e.name }"/>-->
    <nuxt-child :key="$route.name"/>
</div>
</template>
<style>
    .portfolioParent{
        width:100%;
        position:absolute;
        height: 100%;
        top: 0;
    }
</style>
<script>
  export default {
    data(){
        return{
            categories:[{name:"test"}],
            selectedCategory:"",
            selectedCategoryName:"",
            selectedCategoryDescription:"",
            error:{}
        }
    },
    watch: {
        '$route.path': function(path) {
            this.selectedCategory = path.split("/")[2];
        }
    },
    async asyncData (context) {
      try{
        const data = await context.$staticAPI({
          query:`
          query {
              categories(sort:"order"){
                name,
                id,
                slug,
                description,
                tags{
                  name
                }
              },
              tags{
                id,
                name,
                icon
              }
          }
          `
        });
        const categories = data.categories;

        context.store.commit('updateCategoriesAndTags', {categories: data.categories, tags:data.tags});
        console.log(context.store.getters);
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
