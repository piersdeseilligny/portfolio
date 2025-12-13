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
    <div class="headercontainer" style="z-index:3">
	  <nav class="header">
    <div class="navcontainer" >
	    <nuxt-link to="/" class="clickable" style="line-height:1em;font-weight:600; font-size:16px;">
      Piers<br>Deseilligny
      </nuxt-link>
    </div>
	  <div class="navcontainer">
      <nuxt-link to="/work/" class="clickable">Work</nuxt-link>
    </div>
		<div class="navcontainer">
      <nuxt-link to="/contact/" class="clickable">Contact</nuxt-link>
    </div>
    <div class="navcontainer navcontainer-right">
      <nuxt-link to="/tools/" class="clickable">Tools</nuxt-link>
    </div>
	  </nav>
    </div>
    <slot><nuxt/></slot>
  </div>
</div>
</template>
<style>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');

body{
    --maxwidth: 1200px;
    /*--background1: linear-gradient(-45deg, hsl(195, 10%, 10%) 0%, hsl(250, 10%, 10%) 100%);*/
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

    --backgroundbase: hsl(220,10%,6%);
    --backgroundhigh: hsl(220,10%,12%);

    --foreground:hsla(207, 100%, 92%, 0.5);
    --foregroundsubtle:hsla(207, 100%, 92%, 0.35);
    --foregroundlink:hsla(207, 100%, 92%, 0.75);
    --foregroundhigh:hsla(207, 100%, 92%, 0.85);

    --font-primary: 'Poppins', sans-serif;
    --font-secondary: 'Big Shoulders Inline Text', 'DM Serif Display';

    --headerheight:54px;
    --subheaderheight:45px;

    --rightmargin:25%;
    --sidepadding:48px;

    background-color: var(--backgroundbase);
    color:white;
    font-family: var(--font-primary);
    margin:0;
    padding:0;

  }
  html{
    overflow-y:none;
    overflow-x: none;
  }
  .logo{
    height:100%;
    fill:white;
    margin-top:2px;
  }
  .maincontent{
      min-height: fit-content;
      height: 100%;
      width:100%;
      position: absolute;
      display:flex;
      flex-direction:column;
  }
  .centercontent{
    position:relative;
    width:100%;
    height:100%;
    box-shadow: 0 0 16px rgba(0,0,0,0.5);
    background-color:var(--backgroundhigh);
    max-width: var(--maxwidth);
    margin:0 auto;
  }
  .headercontainer{
    background:var(--background4);
    box-shadow:0 0 24px rgba(0,0,0,0.5);
    border-bottom:rgba(255, 255, 255, 0.1) solid 1px;
    z-index:1;
    position:relative;
    width:100%;
  }
  .subheader1container{
    background:var(--background3);
    box-shadow:0 0 24px rgba(0,0,0,0.5);
    border-bottom:rgba(255, 255, 255, 0.1) solid 1px;
    position:relative;
    top:var(--headerheight);
    z-index:2;
    width:fit-content;
  }
  .header{
    display:flex;
    align-items:stretch;
    position: relative;
    font-family: var(--font-secondary);
    max-width:var(--maxwidth);
    margin: 0;
    box-sizing:border-box;
    overflow-x: overlay;
        border-left: rgba(255, 255, 255, 0.1) solid 1px;
  }
  .subheader1container{
    box-shadow:0 0 24px rgba(0,0,0,0.5);
  }
  .navcontainer{
    border-right:rgba(255, 255, 255, 0.1) solid 1px;
    box-sizing: border-box;
  }
  .navcontainer-right{
    border-left:rgba(255, 255, 255, 0.1) solid 1px;
    margin-left:auto;
  }
  .header a{
    display:block;
    height: 100%;
    font-weight: 200;
    font-size:1.25em;
    line-height:1em;
    height:32px;
    padding:10px 22px;
    color:rgba(255,255,255,0.5);
    line-height:32px;
    box-shadow:0 0 0px rgba(0,0,0,0);
    transition:all 0.2s;
    text-decoration: none;
    border-bottom:2px solid transparent;
  }

  .header a:hover{
    background-color:rgba(255,255,255,0.05);
    box-shadow:0 0 24px rgba(0,0,0,0.5);
  }
  .header a:active{
    background: linear-gradient(45deg, hsla(195, 50%, 60%, 0.75) 0%, hsl(111, 50%, 60%, 0.75) 100%);
  }
  .subheader1 a{
    height:18px;
    font-size:0.9em;
    line-height: 18px;
  }
  .header a.clickable{
    color:rgba(255,255,255,0.8);
  }
  .subheader1 a.clickable{
    color:rgba(255,255,255,0.6);
  }
.header a.selected{
    background-color:rgba(255,255,255,0.1);
    border-bottom:2px solid white;
}
.tag-icon{
  display:inline-block;
  width: 16px;
  margin-right:4px;
}
.tag-icon svg{
  max-width: 16px;
  max-height: 16px;
  margin-bottom:-2px;
  fill:currentColor;
}

.content-tags{
  line-height: 14px;
  font-size:12px;
  color:var(--fgcolor);
  margin-bottom:12px;
}
.content-tags>span{
  display:inline-block;
  opacity:0.6;
}
.content-tags i{
  break-after: avoid;
}
.content-tags svg {
  fill:var(--fgcolor);
  max-height:14px;
  width:14px;
  margin-right:4px;
  margin-bottom:-2px;
  display:inline-block;
}


h1{
  font-size:2.5em;
  font-weight: 600;
  margin-top:0;
  margin-bottom:0;
}
h2{
  font-size:1em;
  font-weight: 600;
  margin-top:0;
  margin-bottom:0;
}

h2.lined{
  display: flex;
  align-items: center;
}
h2.lined::after {
  content: '';
  flex: 1;
  margin-left: 1rem;
  margin-right:12px;
  height: 1px;
  margin-top:1px;
  opacity:0.5;
  background: var(--foregroundlink);
  transition: opacity 0.2s;
}
h2.lined.hideline::after{
  opacity:0;
}
.alth2 {
    margin-top: 48px;
    color: var(--foregroundhigh);
    font-size:24px;
    font-weight:500;
    margin-bottom:0;
}
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

    .fx-hovershadow:not(.childshadow){
      box-shadow: 0 0 24px rgba(0,0,0,0.5);
    }
    .fx-hovershadow:not(.childshadow):hover{
      box-shadow: 0 6px 24px rgba(0,0,0,0.8);
    }
    .fx-hovershadow:not(.childshadow):active{
      box-shadow: 0 4px 12px rgba(0,0,0,1);
    }
    .fx-hovershadow.childshadow > img{
      filter: drop-shadow(0px 0px 24px rgba(0,0,0,0.5));
      transition: filter 0.2s;
    }
    .fx-hovershadow.childshadow:hover > img{
      filter: drop-shadow(0px 6px 24px rgba(0,0,0,0.8));
    }
    .fx-hovershadow.childshadow:active > img{
      filter: drop-shadow(0px 4px 12px rgba(0,0,0,1));
    }

@media screen and (max-width: 600px) {
  body{
    --rightmargin:0px;
    --sidepadding:12px;
  }
}

@media screen and (max-width: 800px) {
  .headercontainer{
    width:100%;
  }
  .subheader1container{
    width:100%;
  }
}

.nuxt-progress{
  top:1px;
  background: linear-gradient(90deg, hsl(195, 50%, 60%) 0%, hsl(111, 50%, 60%) 100%);
}
</style>
<script>

</script>
