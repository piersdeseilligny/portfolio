export default function () {
    this.nuxt.hook('generate:done', (context) => {
      const routesToExclude = ['/404', '/404/']
      const allRoutes = Array.from(context.generatedRoutes)
      let routes = allRoutes.filter(route => !routesToExclude.includes(route))

      routes = routes.map(function(val){
        if(!val.endsWith('/')){
           return val + '/'
        }
        else return val;
      });
  
      this.nuxt.options.sitemap.routes = Array.from(new Set(routes)).filter(route => !routesToExclude.includes(route))
    })
  }