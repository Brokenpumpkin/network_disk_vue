import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import axios from 'axios'
import store from './store'
import saveAs from 'file-saver';
import clipboard from 'clipboard';
import uploader from 'vue-simple-uploader';

Vue.prototype.clipboard = clipboard;
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:51002'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(uploader);

new Vue({
  store,
  router,
  saveAs,
  render: h => h(App)
}).$mount('#app')
