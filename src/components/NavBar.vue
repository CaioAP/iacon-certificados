<template>
  <div id="nav" class="nav">
    <router-link :to="{ name: 'Documentos', params: { userhash: 'qwerty' } }">
      Documentos |
    </router-link>

    <nav>
      <router-link :to="{ name: 'NewUser' }">
        | Cadastro de Usuários
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
div#nav {
  display: flex;
  justify-content: center;
}
</style>
