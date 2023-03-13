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
  height: calc(100% - 64px);
  max-width: var(--maxwidth);
  background: var(--backgroundhigh);
  position: relative;
  width: 100%;
  margin: auto;
  box-sizing: border-box;
  overflow-y: auto;
  display:flex;
  flex-direction: column;
}
.contactpage .top{
  margin-bottom:48px;
}
.contactpage .bottom{
  background-color: rgba(0,0,0,0.5);
  background-position: center;
  background-size:cover;
  flex-basis: 100%;
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
    async asyncData (context) {
      try{
        const data = await context.$staticAPI({
          query:`
          query{
  contactImage{
    image{
      url
    }
  }
}
          `
        });
        let backgroundImage = undefined;
          for (const image of data.contactImage.image) {
              context.$staticAsset(image.url);
          }
        
        if(data.contactImage && data.contactImage.image && data.contactImage.image.length){
          var randomIndex = Math.floor(Math.random() * data.contactImage.image.length);
          backgroundImage = data.contactImage.image[randomIndex];
        }
        return{ backgroundImage:backgroundImage }
      }
      catch(err){
        return {
          error: err
        }
      }
    },
}
</script>
