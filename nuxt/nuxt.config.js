

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Piers Deseilligny',
    htmlAttrs: {
      lang:'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'msapplication-TileColor', content:"#da532c" },
      { name: 'theme-color', content:"#ffffff" },
      { hid: 'description', name: 'description', content: '' },
      { hid: 'og-title', property: 'og:title', content: 'Piers Deseilligny' },
      { hid: 'og-sitename', property: 'og:sitename', content: 'Piers Deseilligny' },
      { hid:'og-type', property:'og:type', content:"website"},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes:'32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes:'16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#447b82' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href:'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Poppins:wght@300;400;500;600&display=swap' }
    ]
  },

  publicRuntimeConfig:{
    strapiBaseUri: process.env.API_URL || "http://localhost:3001"
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  server:{
    port:3000,
    host:"0.0.0.0"
  },
  //target: "static",

    loading: {
      color: 'white',
      height: '2px'
    },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~plugins/filterdocs.js",
    "~plugins/formatDate.js",
    "~plugins/vue-tilt.client.js",
    "~plugins/staticAPI.client.js",
    "~plugins/staticAPI.server.js",
    "~plugins/staticAsset.client.js",
    "~plugins/staticAsset.server.js",
    { src:"~plugins/vue-embed.js", mode:"client" },
    { src:"~plugins/vue-cool-lightbox.js", mode:"client" },
    { src: '~/plugins/vue-matomo.js', ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['@nuxtjs/strapi', '@nuxtjs/markdownit',
['nuxt-matomo', { matomoUrl:'//analytics.piersdeseilligny.com/', siteId: 1, onMetaChange: true}]],

  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    injected: true,
    use: [
      ['markdown-it-link-attributes', {attrs: {target: '_blank', rel: 'noopener'}}],
    ]
  },

  strapi: {
    entities: ['documents', 'categories'],
    url: process.env.API_URL || "http://localhost:3001"
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  }
}
