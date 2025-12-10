<template>
<li class="tool-item" v-tilt>
  <nuxt-link :to="link">
  <h4 class="fancy">{{ name }}</h4>
  <p>{{ description }}</p>
  </nuxt-link>
</li>
</template>
<style>
h4{
  margin:0;
  color:var(--foregroundhigh);
}
p{
  color:rgba(215, 237, 255, 0.5);
}
.tool-item{
  padding:12px;
  max-width: 500px;
  border: solid 1px rgba(255,255,255,0.1);
  list-style: none;
  transition:all 0.2s;
}
.tool-item a{
  text-decoration: none;
}
.tool-item:hover{
    background-color:rgba(255,255,255,0.05);
    box-shadow:0 0 24px rgba(0,0,0,0.5);
}
.tool-item p{
  font-size:13px;
}
</style>
<script>
  export default {
    props: ["name", "description", "link"],
    methods:{

    }
  }
</script>
