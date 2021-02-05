<template>
  <div class="d-flex justify-content-center">
    <img class="bg-image" :src="backgroundImage" alt="" />
    <form class="login" @submit.prevent="login">
      <img class="logo-image" :src="logoImage" alt="" />
      <div class="form-group">
        <label for="input-username">Usuário</label>
        <input
          type="text"
          id="input-username"
          class="form-control"
          v-model="username"
          placeholder="Nome de usuário"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input
          type="password"
          id="input-password"
          class="form-control"
          v-model="password"
          placeholder="Senha"
          required
        />
      </div>
      <button type="submit" id="btn-login" class="btn btn-success btn-login">Login</button>
      <b-alert v-model="alertLogin" variant="danger" dismissible>
        Erro ao tentar logar!
      </b-alert>
    </form>
    <img class="logo-bottom" :src="logoBottom" alt="" />
  </div>
</template>

<script>
import { AUTH_REQUEST } from '../store/actions/auth'
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      alertLogin: false
    }
  },
  computed: {
    backgroundImage() {
      return require('@/assets/login-background.png')
    },
    logoImage() {
      return require('@/assets/logo-soma.png')
    },
    logoBottom() {
      return require('@/assets/logo-gs.png')
    }
  },
  methods: {
    login: function() {
      console.log(`ta passando aqui`)
      const { username, password } = this
      this.$store
        .dispatch(AUTH_REQUEST, { username, password })
        .then(() => {
          console.log(`ta passando aqui ok`)
          this.$router.push('/documentos')
        })
        .catch((error) => {
          console.log(error)
          this.alertLogin = true
        })
    }
  },
}
</script>

<style lang="scss" scoped>
.bg-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.logo-image {
  width: 100%;
}
.logo-bottom {
  position: absolute;
  bottom: 3vh;
  max-width: 6vw;
}
.login {
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 10px;
  color: #fff;
  position: absolute;
  left: calc(50vw - 200px);

  .form-group {
    input.form-control {
      box-shadow: 0px 1px 2px 0px #00000088 !important;
    }
    input.form-control:focus {
      transform: translateY(-1px);
      border: 1px solid #007bff;
      box-shadow: 0px 2px 4px 1px #00000088 !important;
    }
  }

  .form-group:last-of-type {
    margin-bottom: 32px;
  }

  button#btn-login {
    margin-bottom: 24px;
    box-shadow: 0px 1px 2px 0px #000000 !important;
  }
  button#btn-login:hover {
    transform: translateY(-1px);
    box-shadow: 0px 2px 4px 1px #000000 !important;
  }
}
</style>
