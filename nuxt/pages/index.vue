<template>
<div>
  <div class="home">
    <video-embed class="showreel-container" src="https://youtu.be/U6UP8V_mWxc"></video-embed>
    <div class="padder">
    <div class="indexcontainer">
      <div class="indexcontainer-about">
        <template v-if="home.underconstruction">
          <h1>Website currently under construction</h1>
          <p>I'm still finalizing the design and content of my personal website, but please don't hesitate to come back and check it out in a couple weeks :)</p>
        </template>
        <h1 class="emphasis" style="margin-top:48px;">About me</h1>
        <div class="highlighted" v-html="home.subtitle">Cinematography • Color grading • Software development</div>
        <div v-html="home.description"></div>
        <Links class="indexcontainer-secondlinks" style="display:none;"/>
        <h2 class="alth2">My work</h2>
        <CategoriesHero :categories="categories"/>

      </div>
      <Links class="indexcontainer-links"/>
    </div>
    </div>
    <div class="randomsample">
      <div class="padder">
        <h2 class="alth2"><span style="margin-right:12px;">Random sample</span>
          <div ref="showanother" class="showanother" @click.prevent="randomImage(true)">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            	 viewBox="0 0 14 12.5" style="enable-background:new 0 0 14 12.5;" xml:space="preserve">
            <polygon fill="currentColor" points="1.5,1.1 2.5,2.1 5,2.1 5,4.6 6,5.6 6,1.1 "/>
            <path fill="currentColor" d="M8.7,1.6L8.4,2.5c1.5,0.6,2.6,2,2.6,3.7c0,2.2-1.8,4-4,4s-4-1.8-4-4c0-1.6,0.9-3,2.3-3.6l0.4-1.2C3.6,2,2,3.9,2,6.3
            	c0,2.8,2.2,5,5,5s5-2.2,5-5C12,4.1,10.6,2.3,8.7,1.6z"/>
            </svg>
            Show another
          </div>
        </h2>
        <p class="fancy" v-html="hero.caption"></p>
        <div class="content-tags" style="--fgcolor:var(--foreground);margin-top:0px;margin-bottom:0;" v-if="hero.document"><span v-for="tag in hero.document.tags" :key="tag.id"><i v-html="tag.icon"></i>{{tag.name}}&nbsp;&nbsp;&nbsp;</span></div>
      </div>
      <div :style="`position:relative;padding-top:${(hero.image.height/hero.image.width)*100}%;transition: padding-top 0.2s;`">
        <img id="randomimage" alt="" @load="loadimage" style="position:absolute;top:0;left:0;right:0;width:100%;" :src="hero.image.url">
      </div>
    </div>
  </div>

  <div >
    <Contact style="background-color:hsla(207,100%,92%,0.1);padding-bottom:72px;padding-top:72px;" nolinks="true"/>
    <div class="footer">
      <span class="copyright">©{{ new Date().getFullYear() }} Piers Deseilligny</span>
      <span>This website is <a class="fancy" rel="noopener" target="_blank" href="https://github.com/piersdeseilligny/portfolio">open-source</a></span>
    </div>
  </div>
</div>
</template>
<style>
.footer{
  font-size:11px;
  color:rgba(215, 237, 255, 0.4);
  background-color:var(--backgroundhigh);
  text-align:center;
  padding:24px;
}
.copyright{
  display:block;
  margin-bottom:0px;
  font-size:13px;
}
.indexcontainer{
  display:flex;
  --rightmargin:48px;
}
.indexcontainer-links{
  flex-direction: column;
  height:fit-content;
  margin-top:96px;
  flex-basis:25%;
  flex-shrink: 0;
}
.highlighted{
  background: var(--background7);
  background-clip: text;
  font-weight: bold;
  margin-top:6px;
  margin-right:var(--rightmargin);
  color:transparent;
  font-size:18px;
}
.home{
  padding-top: 0px;
  background-color:var(--backgroundhigh);
}
.padder{
  padding-right:var(--sidepadding);
  padding-left:var(--sidepadding);
}
.home p{
  color:rgba(215, 237, 255, 0.5);
  font-size:14px;
  margin-right:var(--rightmargin);
  margin-top:6px;
  margin-bottom:4px;
}
h1.emphasis {
  font-family: var(--font-secondary);
  font-weight: 100;
  position: relative;
}
h2.emphasis {
  font-family: var(--font-secondary);
  font-weight: 100;
  font-size: 1.5em;
  opacity: 0.8;
  margin-top: 17px;
  padding-bottom: 5px;
  box-sizing: border-box;
  position: relative;
}

h1.emphasis::after,
h2.emphasis:not(.noline)::after {
  content: " ";
  position: absolute;
  bottom: 0;
  left: 0;
  right: var(--rightmargin);
  height: 1px;
  background: var(--background6);
  border: none;
  transition:0.15s cubic-bezier(0.215, 0.610, 0.355, 1);
}
h2.emphasis.noline{
  margin-bottom:-20px;
}

.showreel-container {
    position: relative;
    height: 0;
    padding-bottom: 56.25%;
    overflow: hidden;
    /* Not needed if it's a block element, like a div */
    width: 100%;
    margin-top:0px;
    box-sizing:border-box;
}
.randomsample img{
  object-fit:cover;
  width:100%;
  margin-top:24px;
  box-shadow: 0 0 24px rgba(0,0,0,0.5);
}

.alth2 {
    margin-top: 48px;
    color: var(--foregroundhigh);
    font-size:24px;
    font-weight:500;
    margin-bottom:0;
}
.randomsampleflex{
  display:flex;
  flex-direction: row;
  width:100%;
  box-sizing: border-box;
}
.randomsampleflex p{
  margin:0;
}
.randomsampleflex > p{
  flex-grow:1;
  margin-top:12px;
}
.showanother{
  color:#6678ac;
  display:inline-block;
  cursor: pointer;
  font-weight:400;
  font-size:14px;
  transition:color 0.2s;
  user-select:none;
}
.showanother:hover{
  color:hsl(202deg 36% 52%);
}
.showanother:active{
  color:hsl(202deg 36% 75%);
}
.showanother svg{
  margin-top:-2px;
  height:18px;
  transform:rotate(0);
  transition:transform 0.2s;
  display:inline-block;
  vertical-align:middle;
}
.showanother:hover svg{
  transform:rotate(-20deg);
}
@keyframes svgrotate {
  from {transform: rotate(-380deg);}
}
.showanother.rotating svg{
  animation-name:svgrotate;
  animation-duration: 0.4s;
}
@media screen and (max-width: 820px) {
  .indexcontainer-links.links{
    display:none;
  }
  .indexcontainer-secondlinks{
    display:flex !important;
  }
  .indexcontainer{
    --rightmargin:0;
  }
}
@media screen and (max-width: 600px) {
 .showreel-container {
    margin-left:-12px;
    margin-right:-12px;
    width:calc(100% + 24px);
  }
}
.showreel-container * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border:none;
}

</style>
<script>
import { gsap } from "gsap";
export default {
    data(){
        return{
            categories:[{name:"test"}],
            error:{},
            imageindex:0,
            home:{

              description:"",
              subtitle:"",
              underconstruction:false,
              images:[]
            },
            hero:{
              document:{
                tags:[]
              },
              image:{
                url:""
              },
              caption:""
            }
        }
    },
    methods:{
      randomImage: function(onclick){
        gsap.to("#randomimage", { opacity:0, duration:0.2 });
        this.hero = this.home.images[this.imageindex];
        if(this.imageindex == this.home.images.length-1){
          this.imageindex = 0;
        }
        else{
          this.imageindex++;
        }
        this.$refs.showanother.classList.add('rotating');
        setTimeout(()=>{ this.$refs.showanother.classList.remove('rotating'); }, 400);
        if(onclick && this.$matomo){
          this.$matomo.trackEvent('Clicks', 'Show another image');
        }
      },
      loadimage: function(){
        gsap.to("#randomimage", { opacity:1, duration:0.2 });
      }
    },
    mounted(){
      function shuffleArray(array) {
        let curId = array.length;
        while (0 !== curId) {
          let randId = Math.floor(Math.random() * curId);
          curId -= 1;
          let tmp = array[curId];
          array[curId] = array[randId];
          array[randId] = tmp;
        }
        return array;
      }
      this.home.images = shuffleArray(this.home.images);
      this.randomImage();
    },
    head() {
      return {
        title: "Piers Deseilligny",
        description:this.home.description,
        meta:[
          { hid:'og-title', property:'og:title', content:'Piers Deseilligny'},
          { hid:'description', name:'description', content:this.home.subtitle},
          { hid:'og-description', property:'og:description', content:this.home.subtitle},
          { hid:'og-image', property:'og:image', content:"https://piersdeseilligny.com"+this.home.metaimage.url },
          { hid:'og-type', property:'og:type', content:"website"},
          { hid:'og-url', property:'og:url', content:"https://piersdeseilligny.com/" }
        ]
      }
    },
    async asyncData (context) {
      try{
        const data = await context.$staticAPI({
          query:`
          query {
              home{
                description,
                metadescription,
                metaimage{
                  url
                },
                subtitle,
                underconstruction,
                images{
                  document{
                    tags{
                      name,
                      icon
                    }
                  }
                  image{
                    url,
                    width,
                    height
                  },
                  caption
                }
              },
              categories(sort:"order"){
                name,
                id,
                slug,
                thumbnailimage{
                  formats
                },
                thumbnailvideo{
                  url
                }
              }
          }
          `
        });
        data.home.description = context.$md.render(data.home.description);

        for(let image of data.home.images){
          //Download all images
          image.image.url = context.$staticAsset(context.$config.strapiBaseUri + image.image.url);
          if(image.caption) image.caption = context.$md.render(image.caption);
        }
        if(data.home.metaimage){
          data.home.metaimage.url = context.$staticAsset(context.$config.strapiBaseUri + data.home.metaimage.url);
        }
        else{
          data.home.metaimage = {url:""};
        }

        console.log(data.home.images)
        const home = data.home;
        const categories = data.categories;
        return{ categories, home }
      }
      catch(err){
        return {
          error: err
        }
      }
    },
}
</script>
