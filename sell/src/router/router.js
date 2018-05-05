import Vue from 'vue';
import VueRouter from 'vue-router';
import goods from './components/goods/goods.vue';

Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    {
      path: '/goods',
      components: goods
    }
  ]
});
export default router;
