<template>
  <div class="docnp-container">
    <div class="docnp-poster">

    </div>
    <div class="docnp-details">
    <a class="docnp-title fancy" target="_blank" :href="doc.np_link">
      {{ doc.title }}
      <span class="docnp-year">({{ doc.date | formatYear }})</span>
    </a>
    <div class="docnp-moreinfo">
      <div class="docnp-mi" v-for="info in doc.moreinfo" :key="info.id">
        <span class="docnp-mi-header" v-if="info.header">
          {{ info.header }}
        </span>
        <a
          target="_blank"
          :href="info.link"
          class="fancy fancysubtle"
          v-if="info.subheader"
        >
          {{ info.subheader }}
        </a>
      </div>
    </div>
    </div>

  </div>
</template>
<style>
.docnp-container{
  padding:0px 12px 0px 0px;
  background:rgba(255,255,255,0.0);
  margin-top: 12px;
  width:276px;
  height:138px;
  display:flex;
}
@media screen and (max-width: 800px) {
  .docnp-container{
    width:213px !important;
    height: 101px !important;
  }
}
.docnp-poster{
  height:64px;
  width:40px;
  margin-right:6px;
  background-color:white;
  opacity:0.1;
}
.docnp-title{
  display:block;
}
.docnp-year{
  opacity:0.6;
}
.docnp-moreinfo {
  display: inline-block;
}
.docnp-mi {
  font-size: 0.7em;
  color: var(--foreground);
}
</style>
<script>
export default {
  props: ["doc"],
};
</script>
