// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
// import * as monaco from ''
// import 'element-ui/lib/theme-chalk/index.css';
// import VueCodemirror from 'vue-codemirror';
// import 'codemirror/lib/codemirror.css';
// import 'jquery';
// import 'xterm/css/xterm.css';
// import { Terminal } from 'xterm';
// import { WebLinksAddon } from 'xterm-addon-web-links';


// Vue.use(axios);
// Vue.use(VueCodemirror, /* {
//   options: { theme: 'base16-dark', ... },
//   events: ['scroll', ...]
// } */)
Vue.use(ElementUI)
Vue.prototype.$axios = axios
// axios.defaults.baseURL = '/api' //每次发送的请求都会带一个/api的前缀
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'
Vue.config.productionTip = false

// require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' }});
window.MonacoEnvironment = { getWorkerUrl: () => proxy };
let proxy = URL.createObjectURL(new Blob([`
    self.MonacoEnvironment = {
        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min'
    };
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/base/worker/workerMain.min.js');
`], { type: 'text/cpp' }));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
