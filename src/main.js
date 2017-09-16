// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

Vue.config.productionTip = false;
Vue.use(VueLazyLoad,{
  loading:'static/loading-svg/loading-bars.svg',
});
Vue.use(infiniteScroll);
//TODO:全局过滤器
// Vue.filter("currency",currency)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
