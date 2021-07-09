<template>
  <div id="body">
    <NavBar v-if="isLoggedIn" />
    <main id="app">
      <router-view />
    </main>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from './store/actions/auth'
import { USER_REQUEST } from './store/actions/user'

export default {
  components: {
    NavBar: () => import('@/components/NavBar.vue')
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated
    }
  },
  name: 'IaconCertificados',
  metaInfo: {
    htmlAttrs: {
      lang: 'pt-BR'
    },
    title: 'Iacon Certificados',
    meta: [
      {
        name: 'description',
        content: ''
      }
    ]
  },
  created() {
    if (this.$store.getters.isAuthenticated) {
      this.$store.dispatch(USER_REQUEST, this.$store.getters.userId)
    }

    this.$axios.interceptors.response.use(undefined, err => {
      return new Promise(() => {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(AUTH_LOGOUT)
        }
        throw err
      })
    })
  }
}
</script>

<style>
@font-face {
  font-family: proximaNovaRegular;
  src: url(./fonts/ProximaNovaRegular.ttf) format('truetype');
}
@font-face {
  font-family: robotoRegular;
  src: url(./fonts/RobotoRegular.ttf) format('truetype');
}
</style>

<style lang="scss">
#body {
  height: 100vh;
  background: var(--light);
}

#app {
  font-family: proximaNovaRegular !important;

  th,
  td,
  label,
  input,
  select,
  textarea {
    font-size: 16px;
    font-family: robotoRegular;
  }

  p {
    margin-bottom: 0;
  }
}
</style>
