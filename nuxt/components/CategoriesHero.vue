<template>
<div class="category-hero-container">

            <nuxt-link
            v-tilt
             class="category-hero fx-hovershadow" v-for="category in categories" :key="category.id"
            :to="{path:'/work', hash: category.slug + '/'}">
            <div class="mask"></div>
            <img v-if="category.thumbnailimage" alt="" :class="{'thumbnail': true, 'novideo':!category.thumbnailvideo}" :src="$staticAsset($config.strapiBaseUri + category.thumbnailimage.formats.small.url)">
            <video ref="vid" alt="" loop muted autoplay v-if="category.thumbnailvideo" :src="$staticAsset($config.strapiBaseUri + category.thumbnailvideo.url)"></video>
            <span>{{ category.name }}</span></nuxt-link>

            <nuxt-link
            v-tilt
             class="category-hero fx-hovershadow viewall"
            to='/work/'>
            <div class="mask"></div>
            <span>View All</span></nuxt-link>
</div>
</template>
<style>
.category-hero-container{
  --heroheight: 112px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:2px;
  margin-top:12px;
  padding-right:var(--rightmargin);
  margin-right:-4px;
}
.category-hero{
  background:var(--backgroundclick);
  text-decoration: none;
  color:white;
  height:var(--heroheight);
  position: relative;
  margin-right:4px;
  font-size:20px;
}
.category-hero.viewall{
  font-size:14px;
  color:rgba(215, 237, 255, 0.5);
}

.category-hero .mask{
  background:black;
  opacity:0.9;
  position:absolute;
  left:1px;
  right:1px;
  top:1px;
  bottom:1px;
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
}
.category-hero.viewall .mask{
  opacity:0.8;
}
.category-hero img.thumbnail{
  position:absolute;
  width:100%;
  height:100%;
  object-fit: cover;
  filter:saturate(0);
  opacity:0.4;
  transition: all 0.4s;
}
.category-hero video{
  opacity:0;
  position:absolute;
  width:100%;
  height:100%;
  object-fit: cover;
  transition: all 0.4s;
}
.category-hero:hover .mask{
  left:3px;
  right:3px;
  top:3px;
  bottom:3px;
  opacity:0.7;
}
.category-hero:hover video{
  opacity:0.5;
}
.category-hero:hover .thumbnail{
  opacity:0;
}
.category-hero:hover .thumbnail.novideo{
  filter:saturate(1);
  opacity:0.5;
}
.category-hero span{
  line-height:var(--heroheight);
  user-select:none;
  text-align: center;
  width:100%;
  display:block;
  position:absolute;
}
</style>
<script>
  export default {
    props: ["selected", "categories"],
    methods:{

    }
  }
</script>
