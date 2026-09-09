const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const needle = require('needle');

export default (context, inject) => {
  // Inject $staticAsset
  inject('staticAsset', function (url, fullurl = false) {
    if (!url) return '';

    if (context.isStatic) {
      // The current target is static, so download/copy any image into dist and return that path
      const filename = url.substring(url.lastIndexOf('/') + 1);
      const distDir = path.resolve('./dist/assets');
      mkdirp.sync(distDir);
      const targetPath = path.join(distDir, filename);

      if (!fs.existsSync(targetPath)) {
        // Check local Strapi uploads folder in repo first for fast, reliable synchronous copying
        const localUploadPath = path.resolve('../strapi/public/uploads', filename);
        if (fs.existsSync(localUploadPath)) {
          fs.copyFileSync(localUploadPath, targetPath);
        } else {
          // Fallback to needle HTTP request for external or remote images
          needle('get', url, { output: targetPath });
        }
      }

      const urlprefix = fullurl ? 'https://piersdeseilligny.com' : '';
      return urlprefix + '/assets/' + filename;
    } else {
      // Non-static environment, return URL as-is
      return url;
    }
  });
};
