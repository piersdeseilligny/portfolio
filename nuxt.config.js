export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'portfolio',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  env: {
    strapiBaseUri: process.env.API_URL || "http://localhost:1337"
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  server:{
    port:3000,
    host:"0.0.0.0"
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~plugins/formatDate.js",
    "~plugins/vue-slick-carousel.js"
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['@nuxtjs/strapi'],

  strapi: {
    entities: ['documents', 'categories'],
    url: 'http://localhost:1337'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
