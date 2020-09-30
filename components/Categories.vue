<template>
    <nav class="header subheader1" style="z-index:2;">
        <div class="navcontainer" v-for="category in categories" :key="category.id">
            <nuxt-link v-if="category.slug == selected" :to="'/portfolio/' + category.slug" class="clickable selected">{{ category.name }}</nuxt-link>
            <nuxt-link v-else :to="'/portfolio/' + category.slug" class="clickable">{{ category.name }}</nuxt-link>
        </div>
    </nav>
</template>
<script>
  export default {
    props: ["selected", "categories"]
  }
</script>