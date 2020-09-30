<template>
    <nav class="header subheader1">
        <p>category={{category}}</p>
        <div class="navcontainer" v-for="tag in tags" :key="tag.id">
            <nuxt-link class="clickable">{{ category.name }}</nuxt-link>
        </div>
    </nav>
</template>
<script>
  export default {
    name: 'App',
    layout: 'default',
    props:["category"],
    data () {
      return {
        tags: [],
        error: null
      }
    },
    async mounted () {
      try {
        this.tags = await this.$strapi.find('tags')
      } catch (error) {
        this.error = error
      }
    }
  }
</script>