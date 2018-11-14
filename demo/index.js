import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';
import App from './App.vue';
import VDragWeektime from '../dist/drag-weektime';
import '../dist/drag-weektime.css';

Vue.use(Vuetify);
Vue.use(VDragWeektime);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
