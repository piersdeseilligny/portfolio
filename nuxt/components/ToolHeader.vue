<template>
  <div class="tool-header">
  <h2 class="alth2" style="margin-top:24px;"><span v-flip-id="flipid">{{ name }}</span></h2>
  <p>{{ description }}</p>
  </div>
</template>
<style>
p{
  color:rgba(215, 237, 255, 0.5);
}
.tool-header{
    margin-bottom:12px;
}
</style>
<script>
import "~/assets/tools.css";
  export default {
    props: ["name", "description", "link", "flipid"],
    methods:{

    }
  }
</script>
