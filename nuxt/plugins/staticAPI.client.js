var hash = require('object-hash');

export default(context, inject) =>
{
  //Inject $staticAsset
  inject('staticAPI', async function(args){
    if(context.isStatic){
      console.log("context is static!");
      let data = await fetch('/api/'+hash.sha1(args)+'.json');
      let json = await data.json();
      return json;
    }
    else{
      console.log("context ain't static");
      //The current target is not static, just return the same URL
      return await context.$strapi.graphql(args);
    }
  })
}
