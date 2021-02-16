import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles.scss'
import axios from 'axios'
import VueMeta from 'vue-meta';
import { BootstrapVue } from 'bootstrap-vue'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// library.add(faUserSecret)
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.use(VueMeta);

Vue.config.productionTip = false

const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

const serverURL = `${location.protocol}//${location.hostname}:2160`

new Vue({
  router,
  store,
  render: h => h(App),
  computed: {
    serverURL() {
      return serverURL
    }
  }
}).$mount('#app')
