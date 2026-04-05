<template>
  <DocumentContent
    :key="$route.params.document"
    :categorySlug="$route.params.slug"
    :documentSlug="$route.params.document"
    :prefetchedDocument="document"
    :prefetchedLightbox="lightboxitems"
    :prefetchedLightboxAlt="lightboxitemsAlt"
    @close="$emit('close')"
  />
</template>

<script>
export default {
  transition: {
    mode: "out-in",
    css: true,
  },
  data() {
    return {
      document: { title: "", tags: [], description: "" },
      lightboxitems: [],
      lightboxitemsAlt: [],
    };
  },
  head() {
    if (this.document && this.document.title) {
      let image = undefined;
      let type = "website";
      if (this.document.poster) {
        image = this.$staticAsset(this.$config.strapiBaseUri + this.bestImageFromLarge(this.document.poster).url, true);
      }
      if (this.$route.params.slug == "software" && this.document.images && this.document.images[0] && this.document.images[0].formats.medium.url) {
        image = this.$staticAsset(this.$config.strapiBaseUri + this.document.images[0].formats.medium.url, true);
      }
      if (this.document.typeoverride) type = this.document.typeoverride
      else {
        switch (this.$route.params.slug) {
          case 'film': type = "video.movie"; break;
          case 'software': type = "softwareapplication";
          default: type = 'website'
            break;
        }
      }
      return {
        title: this.document.title + " - Piers Deseilligny",
        description: this.document.description,
        meta: [
          { hid: 'og-title', property: 'og:title', content: this.document.title },
          { hid: 'description', name: 'description', content: this.document.shortdescription },
          { hid: 'og-description', property: 'og:description', content: this.document.shortdescription },
          { hid: 'og-image', property: 'og:image', content: "https://piersdeseilligny.com" + image },
          { hid: 'og-type', property: 'og:type', content: type },
          { hid: 'og-url', property: 'og:url', content: "https://piersdeseilligny.com/work/" + this.$route.params.slug + "/" + this.$route.params.document + '/' }
        ]
      }
    }
    return null;
  },
  methods: {
    bestImageFromLarge: function (img) {
      if (!img) return { url: "" };
      if (!img.formats) return img;
      if (img.formats.large) return img.formats.large;
      else if (img.formats.medium) return img.formats.medium;
      else if (img.formats.small) return img.formats.small;
      else if (img.formats.thumbnail) return img.formats.thumbnail;
      else return { url: "" };
    }
  },
  async fetch() {
    try {
      const slug = this.$route.params.document;
      const categorySlug = this.$route.params.slug;
      if (!slug) {
        this.document = { title: "" };
        return;
      }
      let q = `
		  query {
			documents(where:{categories:{slug:"${categorySlug}"}, slug:"${slug}"}){
        title,
        typeoverride,
        nopostershadow,
			  description,
        shortdescription,
			  contentblocks{
				tag{
				  name,
				  icon
        },
        title,
        stills{
          formats,
          url,
          caption,
          name
        },
        squarestills,
        videoembed,
        videoembedaspect,
				beforeafters{
				  before{
          formats
          url
				  },
				  after{
          formats
          url
				  },
				  offset
				},
				description
			  },
			  moreinfo{
				link,
				outlink{
				  svg
				  tooltip,
				  name
				},
				header,
				subheader
			  },
			  date,
			  id,
			  slug,
			  backgroundcolor,
			  foregroundcolor,
			  foregroundcolor2,
			  images{
				  formats,
				  url
			  },
			  poster{
          formats,
          width,
          height,
          url
			  },
			  tags{
				  id,
				  name,
				  icon
			  }
			}
		  }
      `;
      
      const apiContext = this.$nuxt ? this.$nuxt.context : this;
      const data = await apiContext.$staticAPI({ query: q });
      
      if (data && data.documents && data.documents.length) {
        let images = [];
        if (data.documents[0].images) {
          for (let img of data.documents[0].images) {
            images.push({
              src: this.$staticAsset(this.$config.strapiBaseUri + img.url),
              description: img.caption,
              thumb: this.$staticAsset(this.$config.strapiBaseUri + img.formats.thumbnail.url)
            });
          }
        }
        let imagesAlt = [];
        if (data.documents[0].contentblocks) {
          for (let block of data.documents[0].contentblocks) {
            if (block.description) {
              block.description = this.$md.render(block.description);
            }
            if (block.stills) {
              for (let i in block.stills) {
                block.stills[i].index = imagesAlt.length;
                block.stills[i].childshadow = (block.stills[i].name && block.stills[i].name.endsWith('_ns.PNG'));
                imagesAlt.push({
                  src: this.$staticAsset(this.$config.strapiBaseUri + block.stills[i].url),
                  description: block.stills[i].caption,
                  thumb: this.$staticAsset(this.$config.strapiBaseUri + block.stills[i].formats.thumbnail.url)
                });
              }
            }
          }
        }

        if (data.documents[0].description) {
          data.documents[0].description = this.$md.render(data.documents[0].description);
        }
        
        this.document = data.documents[0];
        this.lightboxitems = images;
        this.lightboxitemsAlt = imagesAlt;
      } else {
        if (process.server) this.$nuxt.context.error({ message: "Page not found", statusCode: 404 });
      }
    } catch (err) {
      if (process.server) this.$nuxt.context.error({ message: err.message, statusCode: 404 });
    }
  },
};
</script>
