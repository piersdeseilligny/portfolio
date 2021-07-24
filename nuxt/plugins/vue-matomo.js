import Vue from 'vue'
import VueMatomo from 'vue-matomo'

export default ({ app }) => {
  Vue.use(VueMatomo, {
    router: app.router,
    host: 'https://piersdeseilligny.piwik.pro/',
    siteId: "e157db4b-e298-5508-ac3f-10a4429a94fa",
  

    /** Other configuration options **/
  })
}