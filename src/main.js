import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'babel-polyfill';
import VueQuillEditor  from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'element-ui/lib/theme-chalk/index.css';
import '../public/theme-green/index.css';
import '../public/main.css';
import '../public/theme-green/color-green.css';
import Apis from '@/apis/apiPluginExport.js';
import Moment from '@/apis/moment.js';
import Quill from 'quill';
window.Quill = Quill;//fix quill-image-resize插件道入报错bug

Vue.prototype.bucketHost = 'img.10000rc.com';

Vue.use(Apis);
Vue.use(VueQuillEditor);
Vue.use(ElementUI);
Vue.use(Moment);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')