// plugins/flip-directive.js
import Vue from 'vue';
import { Flip } from "gsap/Flip";
import { gsap } from "gsap";

Vue.directive('flip-id', {
  inserted(el, binding, vnode) {
    const id = binding.value;
    el.setAttribute('data-flip-id', id);

    const store = vnode.context.$store;
    const transitions = store.state.flipTransition;
    
    // Safety check: make sure we have data
    const match = transitions && transitions.find(t => t.id === id);

    if (match) {
      // 1. RUN THE FLIP (Immediate Execution)
      Flip.from(match.state, {
        targets: el,
        duration: 0.4, // Slightly longer for elegance
        ease: "power4.out", // Smooth standard easing
        scale: true,   // Performance optimization
      });
    }
  }
});