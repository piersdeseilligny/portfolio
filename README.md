My personal portfolio website: Built using [Nuxt.JS]() and [Strapi](), deployed statically.


## Deployment

The website is deployed statically, for simplicity, speed, cost, and security reasons. Development is done locally with the Nuxt.JS SSR Project, and any content editing takes place on a local Strapi server. Deploying to the web happens as follows:

* With the Strapi server running, execute `npm run generate` in `/nuxt`.
* This will statically generate the project in `/nuxt/dist`
    * During generation, the custom `staticAsset` plugin will copy every asset requested from the strapi server to `dist/assets`
    * The custom `staticAPI` plugin will save every request made to strapi API as a JSON file in `/dist/api`
    * Any request to the strapi API or Assets will therefore become part of the static Nuxt.JS application: for example a request to `http://localhost:1337/graphql` in development becomes `https://piersdeseilligny.com/4ac931e11a8ce8fa09b793f6b5acf6141eff2eb4.json` in production (the filename is a hash of the original GraphQL query made to the strapi server).
* This dist folder can then be uploaded to the website through Git, a script, the hosting provider's web interface, etc...


This method allows for fast and efficient development, while simultaneously keeping hosting extremely fast and cheap: the web server simply needs to be capable of serving static files, instead of running two fairly heavy node.js applications + a database. One gets the benefits of a sophisticated CMS, without needing to actually run it 24/7 in production - which also has the security benefit of severely reducing the attack surface.

However, although this method works well for a small-scale portfolio website, it wouldn't scale as well as a classic Nuxt+Strapi server, because each asset and API call needs to be saved to disk. It's also impossible to perform complex API Calls, seeing as each response needs to be saved during generation. One also needs to take care during development that any api/asset request goes through the `$staticAPI()` and `$staticAsset()` functions during generation, rather than dynamically at runtime (even if these methods can be used dynamically, they need to be called at least once per asset/api call beforehand, so that all the files are saved to disk).