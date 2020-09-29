import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles.scss'
import { BootstrapVue } from 'bootstrap-vue'
import { VuejsDatatableFactory } from 'vuejs-datatable'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret)

Vue.component('font-awesome-icon', FontAwesomeIcon)

VuejsDatatableFactory.useDefaultType(false).registerTableType(
  'datatable',
  tableType =>
    tableType.mergeSettings({
      table: {
        class: 'table table-hover table-striped'
      },
      pager: {
        classes: {
          pager: 'pagination text-center',
          selected: 'active'
        }
      }
    })
)

Vue.use(BootstrapVue)
Vue.use(VuejsDatatableFactory)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
