export default(context, inject) =>
{
  //Inject $staticAsset
  inject('staticAsset', function(url, fullurl){
    if(context.isStatic){
      //The current target is static, so return the static version from /assets
      let filename = url.substring(url.lastIndexOf('/')+1);
      let urlprefix = "";
      if(fullurl) urlprefix = "https://piersdeseilligny.com"
      return urlprefix+"/assets/"+filename;
    }
    else{
      //The current target is not static, just return the same URL
      return url;
    }
  })
}
