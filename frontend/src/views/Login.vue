<template>
  <section class="page">
    <validation-observer
      ref="formulario"
      v-slot="{ validate, invalid }"
      tag="div"
      class="form-login"
    >
      <form class="login" @submit.prevent="validate().then(login)">
        <img class="logo-image" :src="logoImage" alt="" />
        <div class="form-inputs">
          <form-input
            v-model="username"
            label="Usuário"
            placeholder="E-mail ou cnpj"
            required
          />
          <form-input
            v-model="password"
            label="Senha"
            placeholder="Senha"
            type="password"
            required
          />
        </div>
        <form-button
          type="submit"
          variant="success"
          class="btn-login"
          name="Entrar"
          :disabled="loading || invalid"
        />
      </form>
    </validation-observer>
    <b-alert
      class="alerta-login"
      :show="alert.visible"
      :variant="alert.type"
      dismissible
      >{{ alert.message }}</b-alert
    >
  </section>
</template>

<script>
import { AUTH_REQUEST } from '../store/actions/auth'
export default {
  name: 'login',
  components: {
    FormInput: () => import('@/components/Forms/FormInput.vue'),
    FormButton: () => import('@/components/Forms/FormButton.vue')
  },
  data() {
    return {
      username: null,
      password: null,
      alert: {
        visible: false,
        message: '',
        type: 'danger'
      },
      loading: false
    }
  },
  computed: {
    logoImage() {
      return require('@/assets/logo-iacon.png')
    }
  },
  methods: {
    async login() {
      const { username, password } = this
      await this.$store.dispatch(AUTH_REQUEST, { username, password })
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  display: grid;
  z-index: -1;

  & * {
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(../assets/login-background.jpg);
    background-size: cover;
    filter: brightness(0.8);
  }

  .login {
    display: grid;
    place-items: center;
    color: #fff;
    gap: 1rem;
    margin-top: 5rem;

    & * {
      width: 100%;
    }

    .logo-image {
      max-width: 600px;
      margin-bottom: 4rem;
    }

    .form-inputs,
    .btn-login {
      max-width: 400px;
    }
  }
}
</style>
