<template>
  <div class="contentblock">
    <h2>
      <span v-html="block.tag.icon" class="tag-icon"></span>{{ block.tag.name }}
    </h2>
    <div class="contentblock-description fgcolor2">
      {{ block.description }}
    </div>
    <TwentyTwenty
     v-for="ba in block.beforeafters"
     :key="ba.id"
      :before="`//localhost:1337${ba.before.formats.medium.url}`"
      beforeLabel="Before"
      afterLabel="After"
      :offset="ba.offset"
      :after="`//localhost:1337${ba.after.formats.medium.url}`"
    />
    <!--<swiper class="swiper gallery-top" :options="swiperOptionTop" v-if="block.beforeafters">
        <swiper-slide v-for="ba in block.beforeafters" :key="ba.id">
            <img :src="`//localhost:1337${ba.before.formats.medium.url}`"/>
            
        </swiper-slide>
        <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
      <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
    </swiper>-->
  </div>
</template>
<style>
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