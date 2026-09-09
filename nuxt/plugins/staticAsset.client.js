export default (context, inject) => {
  // Inject $staticAsset
  inject('staticAsset', function (url, fullurl = false) {
    if (!url) return '';

    if (context.isStatic) {
      // The current target is static, so return the static version from /assets
      const filename = url.substring(url.lastIndexOf('/') + 1);
      const urlprefix = fullurl ? 'https://piersdeseilligny.com' : '';
      return urlprefix + '/assets/' + filename;
    } else {
      // The current target is not static, just return the same URL
      return url;
    }
  });
};
