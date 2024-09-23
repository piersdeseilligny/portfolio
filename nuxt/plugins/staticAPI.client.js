var hash = require('object-hash');

export default(context, inject) =>
{
  //Inject $staticAsset
  inject('staticAPI', async function(args){
    if(context.isStatic){
      let data = await fetch('/api/'+hash.sha1(args)+'.json?v='+$config.clientVersion);
      let json = await data.json();
      return json;
    }
    else{
      //The current target is not static, just return the same URL
      return await context.$strapi.graphql(args);
    }
  })
}
