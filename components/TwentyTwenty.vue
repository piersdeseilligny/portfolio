<template>
  <div class="twentytwenty-container"
    v-bind:style="containerStyle"
    v-on:touchstart="startSlide"
    v-on:mouseenter="startSlide"
    v-on:mouseleave="endSlide">

    <div
      :style="`position:relative;width:100%;top:0;left:0;padding-top:calc(${aspectRatio * 100
      }%);`"
    ></div>

    <img :src="after" alt="after"
      v-on:mousedown.prevent
      v-on:load="setDimensions" />

    <img :src="before" alt="before"
      v-on:mousedown.prevent
      v-bind:style="beforeImgStyle" />

    <div class="twentytwenty-overlay">
      <div v-if="beforeLabel" class="twentytwenty-before-label">{{beforeLabel}}</div>
      <div v-if="afterLabel" class="twentytwenty-after-label">{{afterLabel}}</div>
    </div>

  </div>
</template>

<script>
import { gsap } from "gsap";
export default {
  data () {
    return {
      imgOffset: null,
      slideOffset: this.offset,
      sliding: false,
      containerStyle: {}
    }
  },
  props: {
    before: {
      type: String,
      required: true
    },
    aspectRatio:{
      type: Number,
      required:true
    },
    beforeLabel: {
      type: String
    },
    after: {
      type: String,
      required: true
    },
    afterLabel: {
      type: String
    },
    offset: {
      type: [String, Number],
      default: 0.5,
      validator: (value) => (value > 0 && value <= 1)
    },
    keyboardStep: {
      type: [String, Number],
      default: 0.2,
      validator: (value) => (value > 0 && value <= 1)
    }
  },
  methods: {
    setDimensions () {
      const img = this.$el.querySelector("img")
      this.imgOffset = img.getBoundingClientRect()
     // this.containerStyle = { width: `${this.w}px`, height: `${this.h}px` };
    },
    startSlide (event) {
      this.sliding = true
      this.moveSlide(event)
    },
    handleArrowNavigation(event) {
      return this.moveSlide(event)
    },
    moveSlide (event) {
      if (this.sliding) {
        var x = (event.touches ? event.touches[0].pageX : event.pageX) - this.imgOffset.left
        x = (x < 0) ? 0 : ((x > this.w) ? this.w : x)
        var newoffset = (x / this.w);
        var offset = Math.abs(this.slideOffset - newoffset);
        
        if(offset>0.05){
          console.log(offset);
          //more than 10 pixels, animate the offset
          gsap.to(this, {slideOffset:newoffset, duration:0.2, ease:"power4.inout"});
        }
        else{
          return this.slideOffset = newoffset;
        }
      }
      if (event.key) {
        switch(event.key) {
          case "Left":     // IE/Edge key
          case "ArrowLeft":  this.slideOffset = ((this.floatOffset - this.floatKeyboardStep) >= 0) ? this.floatOffset - this.floatKeyboardStep : 0 ; break;
          case "Right":    // IE/Edge key
          case "ArrowRight": this.slideOffset = ((this.floatOffset + this.floatKeyboardStep) <= 1) ? this.floatOffset + this.floatKeyboardStep : 1 ; break;
          default: return;
        }
      }
    },
    endSlide () {
      this.sliding = false
    },
    resize () {
      this.containerStyle = {};
      this.$nextTick(() => this.setDimensions());
    }
  },
  computed: {
    beforeImgStyle () {
      return { clip: `rect(0, ${this.x}px, ${this.h}px, 0)` }
    },
    handleStyle () {
      const size = 40;
      return {
        width: `${size}px`,
        height: `${size}px`,
        top:  `calc(50% - ${size/2}px)`,
        left: `calc(${this.slideOffset*100}% - ${size/2}px)`
      }
    },
    x () {
      return this.w * this.slideOffset
    },
    w () {
      return this.imgOffset ? this.imgOffset.width : null
    },
    h () {
      return this.imgOffset ? this.imgOffset.height : null
    },
    floatOffset () {
      return parseFloat(this.slideOffset) 
    },
    floatKeyboardStep () {
      return parseFloat(this.keyboardStep)
    }
  },
  mounted () {
    document.addEventListener("touchmove", this.moveSlide)
    document.addEventListener("touchend", this.endSlide)
    document.addEventListener("mousemove", this.moveSlide)
    window.addEventListener("resize", this.resize)
  },
  beforeDestroy () {
    document.removeEventListener("touchmove", this.moveSlide)
    document.removeEventListener("touchend", this.endSlide)
    document.removeEventListener("mousemove", this.moveSlide)
    window.removeEventListener("resize", this.resize)
  }
}
</script>

<style>
.twentytwenty-container {
  z-index: 9999;
  position: relative;
  overflow: hidden;
  box-sizing: content-box;
  border: solid 1px rgba(255, 255, 255, 0.1);
  margin-top:12px;
}
.twentytwenty-container img {
  max-width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  user-select: none;
  z-index: 20;
}
.twentytwenty-container .twentytwenty-overlay {
  z-index: 25;
  width: 100%;
  height: 100%;
  top: 0;
  position: absolute;
  opacity: 1;
  transition-property: opacity;
  transition-duration: 0.5s;
}
.twentytwenty-container .twentytwenty-overlay .twentytwenty-before-label,
.twentytwenty-container .twentytwenty-overlay .twentytwenty-after-label {
  user-select: none;
  position: absolute;
  font-size: 0.6em;
  top: 0;
  padding: 6px 12px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0px 0px 6px rgba(0, 0, 0, 1);
  text-transform: uppercase;
}
.twentytwenty-container .twentytwenty-overlay .twentytwenty-before-label {
  left: 0;
}
.twentytwenty-container .twentytwenty-overlay .twentytwenty-after-label {
  right: 0;
}

</style>