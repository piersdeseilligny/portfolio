<template>
  <div class="headercontainer">
    <nav class="header">
      <div class="header-fixedwidth">
        <div class="navcontainer">
          <nuxt-link to="/" class="clickable logo" @click.native="menuOpen = false">
            <span>Piers<br>Deseilligny</span>
          </nuxt-link>
        </div>

        <div class="navcontainer">
          <nuxt-link to="/work/" class="clickable" @click.native="menuOpen = false">Work</nuxt-link>
        </div>

        <div class="navcontainer hide-on-narrow">
          <nuxt-link to="/contact/" class="clickable">Contact</nuxt-link>
        </div>
      </div>

      <div class="navcontainer navcontainer-right hide-on-mobile">
        <nuxt-link to="/tools/" class="clickable">Tools</nuxt-link>
      </div>

      <div class="navcontainer navcontainer-right show-on-mobile">
        <button class="menu-btn clickable" @click="toggleMenu" :class="{ active: menuOpen }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      <transition 
        @enter="enterMenu" 
        @leave="leaveMenu" 
        :css="false"
      >
        <div v-if="menuOpen" class="dropdown-menu">
          <nuxt-link to="/contact/" class="dropdown-item show-on-narrow" @click.native="menuOpen = false">
            Contact
          </nuxt-link>
          <nuxt-link to="/tools/" class="dropdown-item" @click.native="menuOpen = false">
            Tools
          </nuxt-link>
        </div>
      </transition>
            <transition 
        @enter="enterBackdrop" 
        @leave="leaveBackdrop" 
        :css="false"
      >
      <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false"></div>
      </transition>
    </nav>
  </div>
</template>

<script>
    import gsap from 'gsap'

export default {
  data() {
    return {
      menuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
        // --- GSAP ANIMATION HOOKS ---
    
    // Dropdown Animations
    enterMenu(el, done) {
      gsap.fromTo(el, 
        { autoAlpha: 0, y: -10, scale: 0.9 }, 
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: 'power4.out', onComplete: done }
      );
    },
    leaveMenu(el, done) {
      gsap.to(el, 
        { autoAlpha: 0, y: -10, scale: 0.9, duration: 0.2, ease: 'power4.in', onComplete: done }
      );
    },

    // Backdrop Animations
    enterBackdrop(el, done) {
      gsap.fromTo(el, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, onComplete: done }
      );
    },
    leaveBackdrop(el, done) {
      gsap.to(el, 
        { opacity: 0, duration: 0.3, onComplete: done }
      );
    }
  }
}
</script>

<style scoped>
.headercontainer {
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.5);
  border-bottom: rgba(255, 255, 255, 0.1) solid 1px;
  z-index: 3;
  position: relative;
  width: 100%;
  background:url(/noisetexture.png), var(--backgroundforblur);
  backdrop-filter: saturate(150%) blur(16px);
}

.header {
  display: flex;
  align-items: stretch;
  position: relative;
  font-family: var(--font-primary);
  max-width: var(--maxwidth);
  margin: 0;
  box-sizing: border-box;
  border-left: rgba(255, 255, 255, 0.1) solid 1px;
  border-right: rgba(255, 255, 255, 0.1) solid 1px;
}
@media (max-width:1200px){
    .header{
        border-left:none;
        border-right:none;
    }
}

.header-fixedwidth {
  display: flex;
  width: 328px;
}

.navcontainer {
  border-right: rgba(255, 255, 255, 0.1) solid 1px;
  box-sizing: border-box;
  flex: 1 1 auto;
  position: relative;
}
.navcontainer:first-child { flex: 0 1 auto; border-left:none; }

.navcontainer-right {
  border-left: rgba(255, 255, 255, 0.1) solid 1px;
  border-right: none;
  flex: 0;
  margin-left: auto;
}


.header .navcontainer a, .menu-btn {
  display: block;
  height: 100%;
  font-weight: 500;
  font-size: 1rem;
  line-height: var(--headerheight);
  padding: 0 16px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  font-family: var(--font-primary);
}

.menu-btn{
    display:flex;
    align-items: center;
    justify-content: center;
    padding:0;
    width:var(--headerheight);
}

.header .logo span {
  font-family: var(--font-secondary);
  font-size: 16px;
  line-height: 16px;
  fill: white;
  display: block;
  padding-top: 10px;
}

.header a:not(.logo) {
  font-size: 0.9rem;
  text-transform: uppercase;
  font-family: var(--font-primary);
  font-weight: 400;
  text-align: center;
}

/* Hover States */
.header a:hover, .menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 20px rgba(0,0,0,0.25);
  color: white;
}
.header a:active, .menu-btn.active {
  background: linear-gradient(45deg, hsla(195, 50%, 60%, 0.75) 0%, hsl(111, 50%, 60%, 0.75) 100%);
  box-shadow: 0 0 12px rgba(0,0,0,0.75);
  color: white;
}
.header a.clickable { color: rgba(255, 255, 255, 0.75); }
.header a.clickable.logo { color: rgba(255, 255, 255, 1); }


/* DROPDOWN MENU STYLES */
.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 200px;
    background-color: var(--backgroundhigh);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 100;
    display: flex;
    flex-direction: column;
}

.dropdown-item {
  text-align: left !important;
  padding: 0 24px !important;
  border-top: 1px solid rgba(255,255,255,0.05);
  height: 100%;
  font-weight: 500;
  font-size: 1rem;
  line-height: 2.75rem;
  padding: 0 16px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  font-family: var(--font-primary);
}

.dropdown-item:last-child {
  border-bottom: none;
}

/* Backdrop to detect outside clicks */
.menu-backdrop {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 100%);
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  height:100vh;
  z-index: 90;
  cursor: default;
  pointer-events: all;
}

/* --- RESPONSIVE LOGIC --- */

/* Default visibility states */
.show-on-mobile { display: none; }
.show-on-narrow { display: none; } 

@media (max-width: 800px) {
    .header-fixedwidth{
        width:auto;
    }
}

/* 1. Mobile Breakpoint (< 600px) */
@media (max-width: 600px) {
  
  .hide-on-mobile { display: none !important; }
  
  .show-on-mobile { 
    display: block; 
    border-left: none;
  }
  
  /* Adjust right container to fill space if needed */
  .navcontainer-right {
    border-left: rgba(255, 255, 255, 0.1) solid 1px;
  }
}
@media (max-width: 350px) {
  .hide-on-narrow { display: none !important; }
  .dropdown-menu .show-on-narrow { display: block; }
}
</style>