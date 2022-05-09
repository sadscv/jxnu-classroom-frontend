import Vue from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import store from './store';
import Button from 'ant-design-vue/lib/button';
import VueClipboard from 'vue-clipboard2';
import './plugins/ant-design-vue';
import Viewer from 'v-viewer';

Vue.use(VueClipboard);
Vue.use(Viewer);
Vue.use(Antd);
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

// if (!Vue.prototype.$showSaveImageDialog) {
//   Vue.prototype.$showSaveImageDialog = () => void 0;
// }

VueClipboard.config.autoSetContainer = true;
Vue.component(Button.name, Button)


new Vue({
  store,
  render: h => h(App),
}).$mount('#app')


