<template>
  <div class="contentblock">
    <h2 v-if="block.tag">
      <span v-html="block.tag.icon" class="tag-icon"></span>{{ block.tag.name }}
    </h2>
    <h2 v-if="!block.tag && block.title">
      {{ block.title }}
    </h2>
    <div class="contentblock-description fgcolor2" v-html="block.description"></div>
    <TwentyTwenty
     v-for="ba in block.beforeafters"
     :key="ba.id"
     :aspectRatio="ba.before.formats.large.height/ba.before.formats.large.width"
      :before="$staticAsset($config.strapiBaseUri+ba.before.url)"
      beforeLabel="Before"
      afterLabel="After"
      :offset="ba.offset"
      :after="$staticAsset($config.strapiBaseUri+ba.after.url)"
    />
    <div class="embed-container" :style="`padding-bottom: ${(1/(block.videoembedaspect ? block.videoembedaspect : 1.77))*100}%`" v-if="block.videoembed">
      <video-embed :src="block.videoembed"></video-embed>
    </div>
    <div :class="{'squarestills':block.squarestills}">
      <figure v-for="still in block.stills" :key="still.url">
        <a :class="{'still':true, 'fx-hovershadow':true, 'childshadow':still.childshadow}" :data-index="still.index" @click.prevent="$emit('openimage', still.index)" :style="`padding-top:${(1/(still.formats.medium.width/still.formats.medium.height) * 100)}%`" :href="$staticAsset($config.strapiBaseUri+still.url)">
          <img :src="$staticAsset($config.strapiBaseUri+still.formats.medium.url)">
        </a>
        <figcaption>{{still.caption}}</figcaption>
      </figure>
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
  /*max-width:712px;*/
  text-align: justify;
}
.contentblock h2 {
  font-size: 16px;
}
.contentblock-description {
  font-size: 13px;
  margin-top:0px;
}

figure{
  margin:0;
  font-size:12px;
}
figcaption{
  margin-top:2px;
  color:var(--fgcolor2);
}
.squarestills{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 12px;
  grid-row-gap: 12px;
}
.still{
  position:relative;
  overflow: hidden;
  height:0;
  display:block;
  transition: 0.2s;
  border: rgba(255, 255, 255, 0.1) solid 1px;
}
.still.childshadow{
  overflow:auto;
  border: solid 1px transparent;
}
.still img{
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
}
.still:hover{
  transform:scale(1.015);
  transition:cubic-bezier(0.215, 0.610, 0.355, 1) 0.15s;
}
</style>
<script>

export default {
  props: ["block","blockindex"]
};
</script>
