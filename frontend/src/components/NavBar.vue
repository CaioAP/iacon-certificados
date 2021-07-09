<template>
  <div id="nav" class="nav">
    <div class="nav-item">
      <img :src="logoIacon" class="logo" />

      <router-link :to="{ name: 'Index' }">
        Certificados
      </router-link>

      <router-link :to="{ name: 'Register' }" v-if="isUserAdmin">
        Cadastrar Cliente
      </router-link>
    </div>

    <form-button
      class="btn-logout"
      variant="default"
      name="Sair"
      @click="logout"
    />
  </div>
</template>

<script>
import LogoIacon from '@/assets/logo-iacon.png'
import { AUTH_LOGOUT } from '../store/actions/auth'

export default {
  components: {
    FormButton: () => import('@/components/Forms/FormButton.vue')
  },
  computed: {
    logoIacon() {
      return LogoIacon
    },

    user() {
      return this.$store.getters.getUserData
    },

    isUserAdmin() {
      return this.user.email === this.$root.admin
    }
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch(AUTH_LOGOUT)
      } catch (error) {
        this.$swal('Erro!', 'Oops! Erro ao sair...', 'error')
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
div#nav {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #001245;
  min-height: 4rem;
  box-shadow: 0px 2px 4px 0px #888888;
  font-style: proximaNovaRegular;
  margin-bottom: 2rem;

  div.nav-item {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    min-height: 4rem;
    width: 100%;
  }

  a {
    margin: 0px 1rem;
    color: #fff;
    padding-bottom: 11px;

    &.router-link-exact-active {
      border-bottom: 2px solid #fff;
      padding-bottom: 8px;
    }
  }

  a:hover {
    text-decoration: none;
  }

  img.logo {
    max-width: 14rem;
    margin: auto 0.75rem;
  }

  .btn-logout {
    color: var(--white);
    border: 1px solid var(--white);
  }

  .btn-logout:hover,
  .btn-logout:focus {
    color: var(--dark);
    background-color: var(--white);
  }
}

@media (min-width: 576px) {
  .nav-item {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .nav-item {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .nav-item {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .nav-item {
    max-width: 1140px;
  }
}
</style>
