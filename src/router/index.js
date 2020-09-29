import Vue from 'vue'
import VueRouter from 'vue-router'
import UserDocuments from '../views/UserDocuments.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/documentos/:userhash',
    name: 'Documentos',
    component: UserDocuments,
    props: true
  },
  {
    path: '/novo-ususuario',
    name: 'NewUser',
    component: () => import('../views/NewUser.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = 'IACON | Documentos'
  next()
})

export default router
