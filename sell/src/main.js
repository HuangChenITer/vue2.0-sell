// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';
import seller from 'components/seller/seller.vue';
import 'common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ]
});

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  eventHub: new Vue(),
  template: '<App/>',
  components: {App}
}).$mount('#app');
router.push('goods');
/*
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
*/
