<template>
  <div
    class="story-container"
    ref="container"
  >
    <div ref="slidecontainer" class="story-slidecontainer">
      <img
        class="story-slide"
        v-for="(slide, slideindex) in slides"
        :key="slide.id"
        :src="slideindex == 0 ? $staticAsset($config.strapiBaseUri + slide.url) : undefined"
        :data-slideindex="slideindex"
        :ref="'slide' + slideindex"
        alt=""
        @load="loadSlide(slideindex + 1)"
        @error="loadSlide(slideindex + 1, true)"
      />
    </div>
    <nav class="story-nav" ref="navBlocks">
      <div v-for="slide in slides" :key="slide.id" class="story-nav-block">
        <span class="story-nav-block-progress" />
      </div>
    </nav>
  </div>
</template>
<style>
.story-container {
  position: relative;
}
.story-nav {
  display: flex;
  align-items: stretch;
  padding: 12px 24px;
  position: absolute;
  width: 100%;
  max-width:200px;
  top: 0;
  left: 0;
  box-sizing: border-box;
}
.obstruction .story-nav{
	transition:all 0.2s;
	transform: translateY(-12px);
	opacity:0;
}
.story-nav-block {
  height: 4px;
  margin: 0 4px;
  width: 100%;
  background-color: var(--fgcolor2);
  opacity:1;
  display:none;
  position: relative;
  box-shadow: 0px 0px 12px var(--bgcolor);
}
.story-nav-block-progress {
  height: 4px;
  position: absolute;
  background-color: var(--fgcolor);
  width: 1%;
}
.story-slidecontainer {
}
.story-slide {
  width: 100%;
  position: absolute;
  transition: opacity 0.4s;
  opacity: 0;
}
.visibleslide {
  opacity: 1;
}
</style>
<script>
const clickMaxLength = 400; //click difference between "pause" and "click"
import { gsap } from "gsap";
function getOffset(event, container) {
  let boundingrects = container.getBoundingClientRect();
  if(boundingrects){
  var x =
    (event.touches ? event.touches[0].pageX : event.pageX) - boundingrects.left;
  x = x < 0 ? 0 : x > boundingrects.width ? boundingrects.width : x;
  return x / boundingrects.width;
  }
  return 0;

}

export default {
  props: ["slides"],
  data() {
    return {
      timeline: undefined,
      pausetime: Number.NaN,
      focustimeout: undefined,
      activeslide: 1,
    };
  },
  methods: {
    loadSlide(slideindex, iserror) {
      if (iserror)
        console.info(
          "Failed to load previous image!! loading " + slideindex + " instead"
        );
      let slidetoLoad = this.$refs["slide" + slideindex];
      if (slidetoLoad && slidetoLoad[0] && this.slides[slideindex]) {
        slidetoLoad[0].setAttribute(
          "src",
          this.$staticAsset(this.$config.strapiBaseUri + this.slides[slideindex].url)
        );
      } else {
        console.info("Slide " + slideindex + " doesn't exist!!");
      }
    },
    showSlide(slideindex) {
      this.activeslide=slideindex;
      if (document) {
        let htmlslides = document.getElementsByClassName("story-slide");
        for (let i = 0; i < htmlslides.length; i++) {
          const element = htmlslides[i];
          if (element.getAttribute("data-slideindex") == slideindex) {
            element.classList.add("visibleslide");
          } else {
            element.classList.remove("visibleslide");
          }
        }
      }
    },
    clickDown() {
      this.pausetime = new Date().getTime();
      this.timeline.pause();
      this.focustimeout = setTimeout(() => {
		  this.$emit('hideobstruction');
	  }, clickMaxLength);
    },
    clickUp() {
      if (this.focustimeout) {
		clearTimeout(this.focustimeout);
		this.focustimeout = undefined;
		this.$emit('showobstruction');
      }
      if (new Date().getTime() - this.pausetime < clickMaxLength) {
        //click lasted less than 400ms, take action
        let offset = getOffset(event, this.$refs.container);
        if (offset < 0.5) {
          //previous slide
          let prevLabel = 0;
          let previouslabel = this.timeline.previousLabel();
          if(previouslabel && previouslabel.replace){
            prevLabel = Number.parseInt(this.timeline.previousLabel().replace("slide_", ""));
          }
          if (prevLabel != 0) prevLabel--;
          if (prevLabel == undefined) prevLabel = this.timeline.previousLabel();
          this.timeline.seek("slide_" + prevLabel);
          this.timeline.play();
        } else {
          //next slide
          let nextlabel = this.timeline.nextLabel();
          if (nextlabel) this.timeline.seek(nextlabel);
          else this.timeline.seek(0);
          this.timeline.play();
        }
      } else if (this.timeline.paused) {
        this.timeline.play();
      }
    },
  },
  mounted: function () {
    let blocks = this.$refs.navBlocks.getElementsByClassName(
      "story-nav-block-progress"
    );
    this.timeline = gsap.timeline({
      defaults: { ease: "linear", duration: 4 },
      onComplete: function () {
        for (let i = 0; i < blocks.length; i++) {
          blocks[i].style.width = "0";
        }
        this.restart();
      },
    });
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].style.width = "0";
      this.timeline.addLabel("slide_" + i);
      this.timeline.to(blocks[i], {
        width: "100%",
        onStart: () => {
          this.showSlide(i);
        },
      });
    }
    this.timeline.play();
  },
  beforeDestroy: function () {
    this.timeline.kill();
  },
  fetch: function(){
    if(process.server){
      this.slides.forEach((slide, index) => {
         this.$staticAsset(this.$config.strapiBaseUri + slide.url);
      });
    }
  }
};
</script>
