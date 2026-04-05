<template>
<div class="portfolioParent">
    <nuxt-child :key="$route.query.context || $route.params.slug || 'all'"/>
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
    async asyncData (context) {
      try{
        let categories = context.store.categoriesArray;
        return{ categories }
      }
      catch(err){
        return {}
      }
    },
  }
</script>

