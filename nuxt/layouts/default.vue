<template>
  <div class="maincontent">
    <svg aria-hidden="true" focusable="false" style="width:0;height:0;position:absolute;">
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%" style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
        <stop offset="0%" stop-color="#476b85" />
        <stop offset="100%" stop-color="#3d8f7a" />
      </linearGradient>
      <linearGradient id="gradient-instagram" x1="0%" y1="100%" x2="100%" y2="0%" style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
        <stop offset="0%" stop-color="#FBBD65" />
        <stop offset="50%" stop-color="#C2327C" />
        <stop offset="100%" stop-color="#6C53BC" />
      </linearGradient>
      <linearGradient id="gradient-linkedin" x1="0%" y1="100%" x2="100%" y2="0%" style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
        <stop offset="0%" stop-color="#095bac" />
        <stop offset="100%" stop-color="#237cd5" />
      </linearGradient>
      <linearGradient id="gradient-imdb" x1="0%" y1="100%" x2="100%" y2="0%" style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
        <stop offset="0%" stop-color="#e2b616" />
        <stop offset="100%" stop-color="#ffdc18" />
      </linearGradient>
      <linearGradient id="gradient-github" x1="0%" y1="100%" x2="100%" y2="0%" style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#f0f0f0" />
      </linearGradient>
    </svg>

    <div class="centercontent">
      <NavBar />
      
      <slot><nuxt /></slot>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue' // Adjust path if necessary

export default {
  components: {
    NavBar
  }
}
</script>

<style>
/* GLOBAL CSS VARIABLES & RESET 
  These must remain here so they are accessible by NavBar and other components.
*/
body {
  --maxwidth: 1200px;
  --background2: linear-gradient(90deg, hsl(205, 30%, 19%) 0%, hsl(131, 40%, 10%) 100%);
  --background3: linear-gradient(90deg, hsl(225, 30%, 19%) 0%, hsl(151, 40%, 10%) 100%);
  --background4: linear-gradient(90deg, hsl(245, 30%, 19%) 0%, hsl(171, 40%, 10%) 100%);
  --background5: linear-gradient(90deg, hsl(265, 30%, 19%) 0%, hsl(191, 40%, 10%) 100%);
  --background6: linear-gradient(90deg, hsl(265, 30%, 50%) 0%, hsl(191, 40%, 50%) 100%);
  --background7: linear-gradient(90deg, hsl(265, 30%, 40%) 0%, hsl(191, 40%, 40%) 100%);
  --backgroundclick: linear-gradient(90deg, hsl(205, 30%, 40%) 0%, hsl(165, 40%, 40%) 100%);

  --background1color: hsla(195, 10%, 8%, 0.5);
  --background2color: hsla(205, 30%, 19%, 0.5);
  --background3color: hsla(225, 30%, 19%, 0.5);
  --background4color: hsla(245, 30%, 19%, 0.5);
  --background5color: hsla(265, 30%, 19%, 0.5);

  --backgroundforblur: hsla(220, 10%, 10%, 0.75);
  --backgroundbase: hsl(220, 10%, 6%);
  --backgroundhigh: hsl(220, 10%, 10%);
  --backgroundpaper: url(/noisetexture.png), var(--backgroundhigh);

  --foreground: hsla(207, 100%, 92%, 0.5);
  --foregroundsubtle: hsla(207, 100%, 92%, 0.35);
  --foregroundlink: hsla(207, 100%, 92%, 0.75);
  --foregroundhigh: hsla(207, 100%, 92%, 0.85);

  --font-primary: 'Outfit', sans-serif;
  --font-secondary: 'Oswald', sans-serif;

  --headerheight: 54px;
  --subheaderheight: 45px;

  --rightmargin: 25%;
  --sidepadding: 48px;

  background-color: var(--backgroundbase);
  color: white;
  font-family: var(--font-primary);
  margin: 0;
  padding: 0;
}

html {
  overflow-y: none;
  overflow-x: none;
}

/* Layout Containers */
.maincontent {
  min-height: fit-content;
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow-y:hidden;
}

.centercontent {
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.5);
  max-width: var(--maxwidth);
  margin: 0 auto;
}

/* Global Content Styling (Headings, Text, Scrollbars) */
h1 {
  font-size: 2.5em;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0;
}

h2 {
  font-size: 1em;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0;
}

h2.lined {
  display: flex;
  align-items: center;
}

h2.lined::after {
  content: '';
  flex: 1;
  margin-left: 1rem;
  margin-right: 12px;
  height: 1px;
  margin-top: 1px;
  opacity: 0.5;
  background: var(--foregroundlink);
  transition: opacity 0.2s;
}

h2.lined.hideline::after {
  opacity: 0;
}

.alth2 {
  margin-top: 48px;
  color: var(--foregroundhigh);
  font-size: 2rem;
  font-family: var(--font-secondary);
  margin-bottom: 0;
}

h4 {
  color: var(--foregroundhigh);
  font-family: var(--font-secondary);
  font-size: 1.25rem;
  font-weight: 600;
}

p {
  line-height: 1.25rem;
  margin-block-start: 0.5rem;
  margin-block-end: 1rem;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background: hsla(207, 100%, 92%, 0.1);
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: hsla(207, 100%, 92%, 0.2);
}

::-webkit-scrollbar-thumb:hover {
  background: hsla(207, 100%, 92%, 0.4);
}

::-webkit-scrollbar-thumb:active {
  background: hsla(207, 100%, 92%, 0.9);
}

/* Utility / Global Classes */
.tag-icon {
  display: inline-block;
  width: 16px;
  margin-right: 4px;
}

.tag-icon svg {
  max-width: 16px;
  max-height: 16px;
  margin-bottom: -2px;
  fill: currentColor;
}

.content-tags {
  line-height: 0.8rem;
  font-size: 0.8rem;
  color: var(--fgcolor);
  margin-bottom: 12px;
  font-weight: 500;
}

.content-tags>span {
  display: inline-block;
  opacity: 0.6;
}

.content-tags i {
  break-after: avoid;
}

.content-tags svg {
  fill: var(--fgcolor);
  max-height: 14px;
  width: 14px;
  margin-right: 4px;
  margin-bottom: -2px;
  display: inline-block;
}

/* FX Styles */
.fx-hovershadow:not(.childshadow) {
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.5);
}

.fx-hovershadow:not(.childshadow):hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.8);
}

.fx-hovershadow:not(.childshadow):active {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 1);
}

.fx-hovershadow.childshadow>img {
  filter: drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.5));
  transition: filter 0.2s;
}

.fx-hovershadow.childshadow:hover>img {
  filter: drop-shadow(0px 6px 24px rgba(0, 0, 0, 0.8));
}

.fx-hovershadow.childshadow:active>img {
  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 1));
}

/* Global Media Queries */
@media screen and (max-width: 600px) {
  body {
    --rightmargin: 0px;
    --sidepadding: 12px;
  }
}

.nuxt-progress {
  top: 1px;
  background: linear-gradient(90deg, hsl(195, 50%, 60%) 0%, hsl(111, 50%, 60%) 100%);
}

[data-flip-id] {
  display: inline-block;
  transform-origin: left center;
}

.tool-body{
  padding-bottom:64px;
  background:var(--backgroundpaper);
  top:0;
  bottom:0;
  left:0;
  right:0;
  padding-top:var(--headerheight);
  position: absolute;
  overflow-y:auto;
}
</style>