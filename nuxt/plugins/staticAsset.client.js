export default(context, inject) =>
{
  //Inject $staticAsset
  inject('staticAsset', function(url, customname=undefined){
    if(context.isStatic){
      //The current target is static, so return the static version from /assets
      let filename = url.substring(url.lastIndexOf('/')+1);
      if(customname) filename=customname;
      return "/assets/"+filename;
    }
    else{
      //The current target is not static, just return the same URL
      return url;
    }
  })
}
