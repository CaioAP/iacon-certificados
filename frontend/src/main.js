import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles.scss'
import axios from 'axios'
import VueMeta from 'vue-meta'
import VueSwal from 'vue-swal'
import { BootstrapVue } from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faFileSignature,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules.umd'

library.add(faFileSignature, faCheck, faTimes)
Vue.component('fa', FontAwesomeIcon)
Vue.use(BootstrapVue)
Vue.use(VueMeta)
Vue.use(VueSwal)

// Axios
Vue.prototype.$axios = axios
Vue.config.productionTip = false

const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

// Form Validations
extend('required', {
  ...required,
  message: field => {
    return field && field !== '{field}'
      ? `Campo ${field} obrigatório`
      : 'Campo obrigatório'
  }
})

extend('email', {
  ...email,
  message: 'Digite um email válido'
})

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

// BaseURL
const serverURL = `${location.protocol}//${location.hostname}:1011`

new Vue({
  router,
  store,
  render: h => h(App),
  computed: {
    serverURL() {
      return serverURL
    },

    admin() {
      return 'admin'
    }
  },
  methods: {
    showSuccessMessage(message) {
      this.$swal('Sucesso!', message, 'success')
    },

    showAlertMessage(message) {
      this.$swal('Alerta!', message, 'warning')
    },

    showErrorMessage(message) {
      this.$swal('Erro!', message, 'error')
    }
  }
}).$mount('#app')
