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
    return {
      title: "Contact - Piers Deseilligny",
      meta:[
        { hid:'og-title', property:'og:title', content:"Contact"},
        { hid:'og-url', property:'og:url', content:"https://piersdeseilligny.com/contact/"},
        { hid:'og-image', property:'og:image', content: (this.backgroundImage ?  this.$staticAsset(this.$config.strapiBaseUri + this.backgroundImage.url) : '') },
        { hid:'og-description', property:'og:description', content:"If you would like to get in touch to discuss my work or a potential collaboration, please reach out to me at contact@piersdeseilligny.com"},
        { hid:'description', name:'description', content:"If you would like to get in touch to discuss my work or a potential collaboration, please reach out to me at contact@piersdeseilligny.com"},
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
                url
              }
            }
          }
        `
      });

      const images = data.contactImage?.image || [];
      for (const image of images) {
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
