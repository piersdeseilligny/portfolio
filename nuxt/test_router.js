const VueRouter = require('vue-router');
const Vue = require('vue');
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/work',
    name: 'work',
    children: [
      {
        path: ':slug?',
        name: 'work-slug',
        children: [{
            path: ':document?',
            name: 'work-slug-document'
        }]
      }
    ]
  }]
});
router.push('/work/').then(() => console.log('1.', router.currentRoute.name, router.currentRoute.params)).catch(e => console.log("err", e));
