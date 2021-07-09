<template>
  <section class="page container">
    <h3 class="title">{{ titulo }}</h3>
    <hr />
    <validation-observer
      ref="formulario"
      v-slot="{ validate, invalid }"
      tag="div"
      class="form-register"
    >
      <form
        class="register d-flex flex-column align-items-center"
        @submit.prevent="validate().then(register)"
      >
        <div class="form-inputs row">
          <form-input
            class="col-md-12 col-sm-12"
            v-model="form.name"
            label="Nome da Empresa"
            required
          />
          <form-input
            class="col-md-6 col-sm-12"
            v-model="form.email"
            label="E-mail"
            required
          />
          <form-input
            class="col-md-6 col-sm-12"
            v-model="form.cnpj"
            label="CNPJ"
            required
          />
          <form-input
            class="col-md-6 col-sm-12"
            v-model="form.password"
            label="Senha"
            type="password"
            required
          />
          <form-input
            class="col-md-6 col-sm-12"
            v-model="form.checkPassword"
            label="Confirmar Senha"
            type="password"
            required
          />
        </div>
        <form-button
          type="submit"
          variant="success"
          class="btn-login"
          name="Salvar"
          :disabled="loading || invalid"
        />
      </form>
    </validation-observer>
  </section>
</template>

<script>
const ACTIONS = {
  INSERT: 'insert',
  UPDATE: 'update'
}

export default {
  components: {
    FormInput: () => import('@/components/Forms/FormInput.vue'),
    FormButton: () => import('@/components/Forms/FormButton.vue')
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        cnpj: '',
        password: '',
        checkPassword: ''
      },
      loading: false
    }
  },
  computed: {
    isEdit() {
      return !!this.$route.params.id
    },

    titulo() {
      return (this.isEdit ? 'Editar' : 'Cadastrar') + ' Cliente'
    }
  },
  methods: {
    getUrl(action) {
      return `${this.$root.serverURL}/users/${action}`
    },

    async register() {
      try {
        const action = this.isEdit ? ACTIONS.UPDATE : ACTIONS.INSERT
        const url = this.getUrl(action)

        const { data } = await this.$axios.post(url, this.form)
        this.$root.showSuccessMessage(data.message)
      } catch (error) {
        this.$root.showErrorMessage(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-inputs {
  width: 100%;
}
</style>
