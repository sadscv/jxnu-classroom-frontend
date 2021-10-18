import Vue from 'vue'
import App from './App.vue'
import Button from 'ant-design-vue/lib/button';
import VueClipboard from 'vue-clipboard2';
import './plugins/ant-design-vue';
import Viewer from 'v-viewer';

Vue.use(VueClipboard);
Vue.use(Viewer);
Viewer.setDefaults({
  inline: false,
  navbar: false,
  title: false,
  toolbar: false,
  rotatable: false,
  scalable: false,
  fullscreen: false,
  minZoomRatio: 0.05,
  maxZoomRatio: 1.5,
});
Vue.config.productionTip = false
VueClipboard.config.autoSetContainer = true;
Vue.component(Button.name, Button)

new Vue({
  render: h => h(App),
}).$mount('#app')


