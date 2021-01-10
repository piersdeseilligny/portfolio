var http = require('http');
var mkdirp = require('mkdirp');
var path = require('path');

var needle = require('needle');

export default(context, inject) =>
{
  //Inject $staticAsset
  inject('staticAsset', function(url, fullurl=false){
    if(context.isStatic){
      console.log("static asset server " + url);
      //The current target is static, so download any image into dist and return that path
      let filename = url.substring(url.lastIndexOf('/')+1);
      mkdirp.sync('./dist/assets');
      needle('get', url, { output: "./dist/assets/"+filename });
      let urlprefix = "";
      if(fullurl) urlprefix = "https://piersdeseilligny.com";
      return urlprefix+"/assets/"+filename;
    }
    else{
      //The current target is not static, just return the same URL
      return url;
    }
  })
}
