<template>
  <div>
    <NavBar v-if="isLoggedIn" />

    <AlertMessage 
      :variant="alert.variant" 
      :show="alert.show" 
      :message="alert.message"
    />

    <div id="app" class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from '@/components/NavBar.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import { AUTH_LOGOUT } from './store/actions/auth'
import { USER_REQUEST } from './store/actions/user'

export default {
  data() {
    return {
      alert: {
        show: false,
        variant: 'success',
        message: ''
      }
    }
  },
  computed: {
    isLoggedIn() {
      console.log(
        'this.$store.getters.isAuthenticated :>> ',
        this.$store.getters.isAuthenticated
      )
      return this.$store.getters.isAuthenticated
    }
  },
  created() {
    if (this.$store.getters.isAuthenticated) {
      this.$store.dispatch(USER_REQUEST)
      this.isLogin = false
    }
    axios.interceptors.response.use(undefined, err => {
      return new Promise(() => {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(AUTH_LOGOUT)
        }
        throw err
      })
    })
  },
  components: {
    NavBar,
    AlertMessage
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: proximaNovaRegular;
  src: url(./fonts/ProximaNovaRegular.ttf) format('truetype');
}
@font-face {
  font-family: robotoRegular;
  src: url(./fonts/RobotoRegular.ttf) format('truetype');
}

div#app {
  font-family: proximaNovaRegular !important;

  input,
  select {
    max-height: 30px;
  }

  th,
  td,
  label,
  input,
  select,
  textarea {
    font-size: 14px;
    font-family: robotoRegular;
  }

  input,
  select,
  textarea {
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0px 1px 2px 0px #88888888;
  }
  input:focus,
  select:focus,
  textarea:focus {
    transform: translateY(-1px);
    box-shadow: 0px 2px 4px 1px #88888888;
  }
  input:disabled,
  select:disabled,
  textarea:disabled {
    background-color: #eeeeee !important;
  }

  button.btn {
    box-shadow: 0px 1px 2px 0px #88888888 !important;
  }
  button.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0px 2px 4px 1px #88888888 !important;
  }
  button.btn:disabled {
    box-shadow: none !important;
  }
  button.btn-apply {
    background-color: #276485 !important;
  }
}
</style>
