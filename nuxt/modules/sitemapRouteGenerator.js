export default function () {
    this.nuxt.hook('generate:done', (context) => {
      const routesToExclude = [] // Add any route you don't want in your sitemap. Potentially get this from an .env file.
      const allRoutes = Array.from(context.generatedRoutes)
      let routes = allRoutes.filter(route => !routesToExclude.includes(route))

      routes = routes.map(function(val){
        if(!val.endsWith('/')){
           return val + '/'
        }
        else return val;
      });
  
      this.nuxt.options.sitemap.routes = [...routes]
    })
  }