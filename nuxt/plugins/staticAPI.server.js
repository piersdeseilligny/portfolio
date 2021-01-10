var http = require('http');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var needle = require('needle');
var hash = require('object-hash');

export default(context, inject) =>
{
  //Inject $staticAsset
  inject('staticAPI', async function(args){
    if(context.isStatic){
      mkdirp.sync('./dist/api');
      console.log("staticAPI");
      let data = await context.$strapi.graphql(args);
      console.log(data);
      fs.writeFileSync('./dist/api/'+hash.sha1(args)+'.json', JSON.stringify(data));

      return data;
    }
    else{
      //The current target is not static, just return the same URL
      return await context.$strapi.graphql(args);
    }
  })
}
