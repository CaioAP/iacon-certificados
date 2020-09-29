<template>
  <div id="app" class="container-fluid">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  metaInfo: {
    title: 'IACON | Documentos'
  },
  components: {
    NavBar
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
}
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
