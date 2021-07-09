import Vue from 'vue'
import store from '../store/index'
import VueRouter from 'vue-router'

const isAuthenticated = () => {
  if (store.getters.isAuthenticated) {
    return true
  }

  return false
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/register/:id',
    name: 'RegisterEdit',
    component: () => import('../views/Register.vue')
  }
  // {
  //   path: '/documentos',
  //   name: 'Documentos',
  //   component: () => import('../views/UserDocuments.vue'),
  //   beforeEnter: (to, from, next) => isAuthenticated(to, from, next)
  // },
  // {
  //   path: '/usuario',
  //   name: 'ListarUsuarios',
  //   component: () => import('../views/UsuarioIndex.vue'),
  //   beforeEnter: (to, from, next) => isAuthenticated(to, from, next)
  // },
  // {
  //   path: '/usuario/form',
  //   name: 'Usuario',
  //   component: () => import('../views/UsuarioForm.vue'),
  //   beforeEnter: (to, from, next) => isAuthenticated(to, from, next)
  // },
  // {
  //   path: '/usuario/form/:username',
  //   name: 'EditarUsuario',
  //   component: () => import('../views/UsuarioForm.vue'),
  //   beforeEnter: (to, from, next) => isAuthenticated(to, from, next)
  // }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = 'IACON | Certificados'
  if (to.name !== 'Login' && !isAuthenticated()) return next('/login')
  next()
})

export default router
