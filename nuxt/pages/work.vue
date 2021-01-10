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
        let categories = context.store.categoriesArray;
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
