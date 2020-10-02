<template>
<div class="maincontent">
	<nav class="header" style="z-index:3;">
    <div class="navcontainer" >
	    <nuxt-link to="/" class="clickable" style="line-height:1em;font-weight:600;">piers<br>deseilligny</nuxt-link>
    </div>
	  <div class="navcontainer">
      <nuxt-link to="/portfolio" class="clickable">portfolio</nuxt-link>
    </div>
		<div class="navcontainer">
      <nuxt-link to="/contact" class="clickable">contact</nuxt-link>
    </div>
	</nav>
	<nuxt/>
</div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&display=swap');
  body{
    background-color:rgb(19, 20, 22);
    color:white;
    font-family: 'Titillium Web', sans-serif;
    margin:0;
    padding:0;
  }
  .maincontent{
      height:100%;
      width:100%;
      position:absolute;
  }
  .header{
    background-color:rgb(35, 37, 41);
    display:flex;
    align-items:stretch;
    box-shadow:0 0 24px rgba(0,0,0,0.5);
    z-index:1;
    position: relative;
    border-bottom:rgba(255, 255, 255, 0.1) solid 1px;
  }
  .subheader1{
    z-index:0;
    background-color:rgb(26, 27, 30);
  }
  .navcontainer{
    border-right:rgba(255, 255, 255, 0.1) solid 1px;
  }
  .header a{
    display:block;
    height: 100%;
    font-weight: 100;
    font-size:1.5em;
    line-height:1em;
    height:48px;
    padding:12px 24px;
    color:rgba(255,255,255,0.5);
    line-height:48px;
    box-shadow:0 0 0px rgba(0,0,0,0);
    transition:all 0.2s;
    text-decoration: none;
    border-bottom:2px solid transparent;
  }
 
  .header a:hover{
    background-color:rgba(255,255,255,0.05);
    box-shadow:0 0 24px rgba(0,0,0,0.5);
  }
  .subheader1 a{
    height:36px;
    font-size:1em;
    line-height: 36px;
  }
  .header a.clickable{
    color:rgba(255,255,255,0.8);
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

</style>
<script>
</script>