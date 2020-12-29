<template>
<div class="subheader1container">
    <nav class="header subheader1">
        <div class="navcontainer" key="all">
            <nuxt-link
            to="/work/"
            :class="`clickable ${!selected ? 'selected' : ''}`"
            v-on:click.native="$emit('select', undefined)">All</nuxt-link>
        </div>
        <div class="navcontainer" v-for="category in categories" :key="category.id">
            <nuxt-link
            :to="'/work/' + category.slug"
            :class="`clickable ${category.slug == selected ? 'selected' : ''}`"
            v-on:click.native="$emit('select', category.slug)">{{ category.name }}</nuxt-link>
        </div>
    </nav>
</div>
</template>
<script>
  export default {
    props: ["selected", "categories"]
  }
</script>
