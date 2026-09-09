<template>
  <div class="contactpage">
    <div class="top">
      <Contact/>
    </div>
    <div v-if="backgroundImage" class="bottom" :style="`background-image:url(${$staticAsset($config.strapiBaseUri + backgroundImage.url)})`">
    </div>
  </div>
</template>
<style>
.contactpage {
  max-width: var(--maxwidth);
  background: var(--backgroundhigh);
  position: absolute;
  width: 100%;
  margin: auto;
  box-sizing: border-box;
  overflow-y: auto;
  display:flex;
  flex-direction: column;
  top: 0;
  bottom: 0;
}
.contactpage .top{
  padding-bottom:24px;
  padding-top:calc(var(--headerheight));
  background: var(--backgroundpaper);
  box-shadow: 0 0 24px rgba(0,0,0,0.5);
  flex:0;
  z-index:1;
}
.contactpage .bottom{
  background-color: rgba(0,0,0,0.5);
  background-position: center;
  background-size:cover;
  flex: 1;
}
@media (max-width:600px){
  .contactpage{
    flex-direction: column-reverse;
  }
  .contactpage .top{
    padding-bottom:64px;
    padding-top:24px;
  }
  .contactpadder.padder{
    padding-right:48px;
    padding-left:48px;
  }
}
@media (max-width:400px){
  .contactpadder.padder{
    padding-right:24px;
    padding-left:24px;
  }
}
</style>
<script>
export default {
    data(){
        return{
            backgroundImage:null,
            error:{}
        }
    },
  head() {
    const title = "Contact | Piers Deseilligny - Director of Photography Scotland";
    const description = "Get in touch with Director of Photography Piers Deseilligny for cinematography, camera operating, and collaborations across Scotland, the UK, and internationally.";
    const imageUrl = this.backgroundImage ? this.$staticAsset(this.$config.strapiBaseUri + this.backgroundImage.url) : '';

    return {
      title,
      meta:[
        { hid:'description', name:'description', content: description },
        { hid:'og:title', property:'og:title', content: title },
        { hid:'og:site_name', property:'og:site_name', content: 'Piers Deseilligny' },
        { hid:'og:url', property:'og:url', content: "https://piersdeseilligny.com/contact/" },
        { hid:'og:image', property:'og:image', content: imageUrl },
        { hid:'og:description', property:'og:description', content: description },
        { hid:'og:type', property:'og:type', content: "website" },
        { hid:'twitter:card', name:'twitter:card', content: 'summary_large_image' },
        { hid:'twitter:title', name:'twitter:title', content: title },
        { hid:'twitter:description', name:'twitter:description', content: description },
        { hid:'twitter:image', name:'twitter:image', content: imageUrl },
      ],
      link: [
        { rel: 'canonical', href: 'https://piersdeseilligny.com/contact/' }
      ]
    }
  },
  async asyncData(context) {
    try {
      const data = await context.$staticAPI({
        query: `
          query{
            contactImage{
              image{
                url,
                width,
                height,
                formats
              }
            }
          }
        `
      });

      const images = data.contactImage?.image || [];
      for (const image of images) {
        context.$responsiveAsset(image);
        context.$staticAsset(image.url);
      }

      let serverSelectedImage = null;
      if (images.length) {
        serverSelectedImage = images[Math.floor(Math.random() * images.length)];
      }

      return { 
        backgroundImage: serverSelectedImage,
        allImages: images 
      }
    } catch (err) {
      return { error: err }
    }
  },
  mounted() {
    if (this.allImages && this.allImages.length) {
      const randomIndex = Math.floor(Math.random() * this.allImages.length);
      this.backgroundImage = this.allImages[randomIndex];
    }
  }
}
</script>
