<template>
  <div class="contentblock">
    <h2 v-if="block.tag">
      <span v-html="block.tag.icon" class="tag-icon"></span>{{ block.tag.name }}
    </h2>
    <h2 v-if="!block.tag && block.title">
      {{ block.title }}
    </h2>
    <div class="contentblock-description fgcolor2">
      {{ block.description }}
    </div>
    <TwentyTwenty
     v-for="ba in block.beforeafters"
     :key="ba.id"
     :aspectRatio="ba.before.formats.large.height/ba.before.formats.large.width"
      :before="$staticAsset($config.strapiBaseUri+ba.before.formats.large.url)"
      beforeLabel="Before"
      afterLabel="After"
      :offset="ba.offset"
      :after="$staticAsset($config.strapiBaseUri+ba.after.formats.large.url)"
    />
    <div class="embed-container" :style="`padding-bottom: ${(1/(block.videoembedaspect ? block.videoembedaspect : 1.77))*100}%`" v-if="block.videoembed">
      <video-embed :src="block.videoembed"></video-embed>
    </div>
  </div>
</template>
<style>
.embed-container {
    position: relative;
    height: 0;
    overflow: hidden;
    /* Not needed if it's a block element, like a div */
    width: 100%;
}

.embed-container * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border:none;
}
.contentblock {
  margin-top: 24px;
  max-width:712px;
  text-align: justify;
}
.contentblock h2 {
  font-size: 16px;
}
.contentblock-description {
  font-size: 13px;
  margin-top:0px;
}
</style>
<script>
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
export default {
  props: ["block"],
  data() {
    return {
      slickOptions: {
  dots: true,
  dotsClass: "slick-dots custom-dot-class",
  edgeFriction: 0.35,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
      }
    };
  },
};
</script>
