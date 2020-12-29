<template>
<div>
  <div class="home">
    <div class="indexcontainer">
      <div class="indexcontainer-about">
        <h1 class="emphasis">About me</h1>
        <div class="highlighted">Cinematography • Color grading • Software development</div>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque egestas non dui vel iaculis. Nulla vehicula luctus porttitor. Etiam feugiat finibus eros et pulvinar. Maecenas pellentesque condimentum magna sit amet malesuada. Morbi sed molestie ex. Fusce cursus gravida eleifend. Nulla sed scelerisque justo. Mauris facilisis arcu id elit imperdiet, sed sollicitudin nibh commodo. Donec auctor, nisi vulputate varius fermentum, sapien neque placerat sem, eget interdum orci lectus quis est.
        </p>

        <h1 class="emphasis">My work</h1>
        <CategoriesHero :categories="categories"/>
      </div>
      <Links class="indexcontainer-links"/>
    </div>
    <h2 class="emphasis noline">Cinematography + Color Grading Showreel 2021</h2>
    <video-embed class="showreel-container" src="https://youtu.be/DCrOr4JmRUU"></video-embed>
  </div>
  <Contact style="background-color:hsla(207,100%,92%,0.1);padding-bottom:72px;"/>
  </div>
</template>
<style>
.indexcontainer{
  display:flex;
  --rightmargin:48px;
}
.indexcontainer-links{
  flex-direction: column;
  height:fit-content;
  margin-top:72px;
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
  padding-top: 24px;
  padding-bottom:0;
  padding-right:var(--sidepadding);
  padding-left:var(--sidepadding);
  background-color:var(--backgroundhigh);
}
.home p{
  color:rgba(215, 237, 255, 0.5);
  font-size:14px;
  margin-right:var(--rightmargin);
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
  top: 100%;
  left: 0;
  right: var(--rightmargin);
  height: 1px;
  background: var(--background6);
  border: none;
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
    width: calc(100% + 96px);
    margin-left:-48px;
    margin-right:-48px;
    margin-top:24px;
    box-sizing:border-box;
}
@media screen and (max-width: 820px) {
  .indexcontainer-links.links{
    display:none;
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
export default {
    data(){
        return{
            categories:[{name:"test"}],
            error:{}
        }
    },
    async asyncData (context) {
      try{
        const data = await context.$strapi.graphql({
          query:`
          query {
              categories{
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
        const categories = data.categories;
        return{ categories }
      }
      catch(err){
        return {
          error: err
        }
      }
    },
}
</script>
