<template>
  <div id="nav" class="nav">
    <div class="nav-item">
      <img :src="logoSoma" class="logo" id="logo-soma" />

      <router-link :to="{ name: 'Documentos' }">
        Documentos
      </router-link>

      <router-link :to="{ name: 'Usuario' }">
        Cadastro de Usuários
      </router-link>
    </div>

    <img :src="logoIacon" class="logo" id="logo-iacon" />
  </div>
</template>

<script>
import LogoIacon from '@/assets/logo-iacon.png'
import LogoSoma from '@/assets/logo-soma.webp'
export default {
  computed: {
    logoIacon() {
      return LogoIacon
    },
    logoSoma() {
      return LogoSoma
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: proximaNovaRegular;
  src: url(../fonts/ProximaNovaRegular.ttf) format('truetype');
}
div#nav {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  background-color: #001245;
  padding: 0px;
  min-height: 60px;
  margin-bottom: 16px;
  box-shadow: 0px 2px 4px 0px #888888;
  font-style: proximaNovaRegular;

  div.nav-item {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    min-height: 60px;
  }

  a {
    margin: 0px 12px;
    // color: #2c3e50;
    color: #fff;
    padding-bottom: 11px;

    &.router-link-exact-active {
      border-bottom: 3px solid #fff;
      padding-bottom: 8px;
      font-weight: bold;
    }
  }
  a:hover {
    text-decoration: none;
  }

  img.logo {
    max-width: 12rem;
    margin: auto 0.75rem;
  }
  img#logo-iacon {
    max-width: 6rem;
  }
}
</style>
