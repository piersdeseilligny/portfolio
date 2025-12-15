// plugins/flip-transition.js
import { Flip } from "gsap/Flip";

export default ({ app, store }) => {
  app.router.beforeEach((to, from, next) => {
    // 1. Reset Store
    store.commit('flipTransition', []);

    // 2. Capture State
    const els = document.querySelectorAll("[data-flip-id]");
    
    if (els.length > 0) {
      const targets = [];
      els.forEach(el => {
        // We freeze the state object to prevent Vue Observer crashes
        targets.push({
          id: el.getAttribute('data-flip-id'),
          state: Object.freeze(Flip.getState(el))
        });
      });
      store.commit('flipTransition', targets);
    }

    next();
  });
};