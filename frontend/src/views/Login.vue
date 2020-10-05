<template>
  <div>
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
      <button type="submit" class="btn btn-success btn-login">Login</button>
      <b-alert v-model="alertLogin" variant="danger" dismissible>
        Erro ao tentar logar!
      </b-alert>
    </form>
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
      return require('@/assets/login-background.jpg')
    },
    logoImage() {
      return require('@/assets/logo-iacon.png')
    }
  },
  methods: {
    login: function() {
      const { username, password } = this
      this.$store
        .dispatch(AUTH_REQUEST, { username, password })
        .then(() => {
          this.$router.push('/documentos')
        })
        .catch(() => {
          this.alertLogin = true
        })
    }
  }
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
  margin-bottom: 5vh;
}
.login {
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 10px;
  color: #fff;
  position: absolute;
  top: 12.5vh;
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

  button.btn-login {
    margin-bottom: 24px;
    box-shadow: 0px 1px 2px 0px #00000088 !important;
  }
  button.btn-login:hover {
    transform: translateY(-1px);
    box-shadow: 0px 2px 4px 1px #00000088 !important;
  }
}
</style>
