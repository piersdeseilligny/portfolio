<template>
  <div class="container">
    <div v-if="error.statusCode === 404">
      <h1>Page not found</h1>
      <p>{{ error.message }}</p>
    </div>
    <div v-else>
      <h1>An error occurred</h1>
    </div>
    <div>
      {{error.message}}
    </div>
    <div style="opacity:0.5;font-family:monospace;">
      {{error}}
    </div>
    <n-link to="/">Home page</n-link>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default' // If you prefers you can set a custom layout for the error page
}
</script>