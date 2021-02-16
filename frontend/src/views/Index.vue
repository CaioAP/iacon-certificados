<template>
  <div class="d-flex justify-content-center">
    <div class="glass-container">
      <p>
        Seja bem-vindo à Soma Contabilidades! Para facilitar cada vez mais o
        processo de entrega de documentos, criamos uma plataforma que
        centralizará a troca de informações entre nós Contabilidade e você,
        nosso cliente. Com ela, você poderá anexar todos os arquivos necessários
        para a realização dos fechamentos contábeis e receber relatórios e
        resultados.
      </p>
    </div>
    <img class="bg-image" :src="backgroundImage" alt="" />
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
.glass-container {
  width: 80vw;
  height: 72vh;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 3rem;
}

.glass-container {
  color: #ded;
  font-size: 1.6rem;
  text-align: center;
}
</style>
