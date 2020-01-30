import Vue from 'vue';
import './validate';
import demo from './index.vue';
// import demo from './slider.vue';

import vpcui from '../index';

Vue.use(vpcui);

new Vue({
  el: '#app',
  template: '<demo></demo>',
  components: {
    demo
  }
});
