<template>
  <nuxt-link v-tilt class="tool-item" :to="link">
      <h4 v-flip-id="flipid" class="fancy">{{ name }}</h4>
      <p>{{ description }}</p>
  </nuxt-link>
</template>
<style>
.tool-item p {
  color: rgba(215, 237, 255, 0.5);
  margin: 6px 0 6px 0;
}

.tool-item h4 {
  margin: 0;
}

.tool-item {
  max-width: 500px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  list-style: none;
  transition: all 0.2s;
  padding: 12px;
  text-decoration: none;
}

.tool-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.5);
}

.tool-item p {
  font-size: 0.9rem;
}
</style>
<script>
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);
export default {
  props: ["name", "description", "link", "flipid"]
}
</script>
