import Vue from 'vue'
import store from '../store/index'
import VueRouter from 'vue-router'
// import UserDocuments from '../views/UserDocuments.vue'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next()
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: (to, from, next) => ifNotAuthenticated(to, from, next)
  },
  {
    path: '/documentos',
    name: 'Documentos',
    component: () => import('../views/UserDocuments.vue'),
    beforeEnter: (to, from, next) => ifAuthenticated(to, from, next)
  },
  {
    path: '/usuario',
    name: 'Usuario',
    component: () => import('../views/Usuario.vue'),
    beforeEnter: (to, from, next) => ifAuthenticated(to, from, next)
  },
  {
    path: '/usuario/:username',
    name: 'Usuario',
    component: () => import('../views/Usuario.vue'),
    beforeEnter: (to, from, next) => ifAuthenticated(to, from, next)
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = 'IACON | Documentos'

  // console.log('to :>> ', to)
  // console.log('from :>> ', from)
  // console.log('next :>> ', next)
  next()
})

export default router
