<template>
  <div class="home">
      <h1 class="emphasis">Error {{error.statusCode}}</h1>
      <p>{{ error.message }}</p>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default' // If you prefers you can set a custom layout for the error page
}
</script>
