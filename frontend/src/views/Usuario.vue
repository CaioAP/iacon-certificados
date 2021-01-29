<template>
  <div class="sections" id="insert-section">
    <b-alert
      :show="alert.countDown"
      :variant="alert.type"
      @dismissed="alert.countDown = 0"
      dismissible
    >
      <p class="alert-message">{{alert.message}}</p>
    </b-alert>
    <Section title="Cadastro">
      <Form justify="start">
        <form-input
          col-size="6"
          input-type="text"
          input-id="input-name"
          v-model="data.name"
          label-text="Nome"
          :require-validation="true"
          validation-message="Nome não pode ser vazio"
          :validator="validators.name"
          :validated="validation.name"
          @validation="(newVal) => {validation.name = newVal}"
        />
        <form-input
          col-size="6"
          input-type="email"
          input-id="input-email"
          v-model="data.email"
          label-text="Email"
          :require-validation="true"
          validation-message="E-mail inválido"
          :validator="validators.email"
          :validated="validation.email"
          @validation="(newVal) => {validation.email = newVal}"
        />
        <form-input
          col-size="6"
          input-type="text"
          input-id="input-username"
          v-model="data.username"
          label-text="Nome de usuário"
          :require-validation="true"
          validation-message="Nome de usuário inválido"
          :validator="validators.username"
          :validated="validation.username"
          @validation="(newVal) => {validation.username = newVal}"
        />
        <form-input
          col-size="6"
          input-type="password"
          input-id="input-password"
          v-model="data.password"
          label-text="Senha"
          :require-validation="true"
          validation-message="Senha inválida"
          :validator="validators.password"
          :validated="validation.password"
          @validation="(newVal) => {validation.password = newVal}"
        />
        <div class="col-12 d-flex justify-content-center align-items-center">
          <button 
            type="submit" 
            class="btn btn-success"
            @click="save"
          >
            {{pageType == 'create' ? 'Salvar' : 'Alterar'}}
          </button>
        </div>
      </Form>
    </Section>
  </div>
</template>

<script>
import Section from '@/components/Section.vue'
import Form from '@/components/Form.vue'
import FormInput from '@/components/FormInput.vue'
import axios from 'axios'
export default {
  components: {
    Section,
    Form,
    FormInput
  },
  data() {
    return {
      alert: {
        countDown: 0,
        type: null,
        message: null
      },
      data: {
        name: '',
        email: '',
        username: '',
        password: ''
      },
      validators: {
        name(text) {
          return text.length > 0
        },
        email(text) {
          return text.indexOf('@') !== -1
        },
        username(text) {
          return text.length >= 5 && /[^a-zA-Z0-9@._-\s]/gm.test(text) === false
        },
        password(text) {
          return text.length > 7 && /[^a-zA-Z0-9!@#$%^&*)(+=._-]/gm.test(text) === false
        },
      },
      validation: {
        name: true,
        email: true,
        username: true,
        password: true,
      },
      loading: false
    }
  },
  computed: {
    baseURL() {
      return `http://${location.hostname}:2160/users`
    },
    pageType() {
      return this.$route.params.username ? 'edit' : 'create'
    }
  },
  methods: {

    async save(event) {
      event.preventDefault()
      event.stopPropagation()

      try {
        const url = `${this.baseURL}/${this.pageType == 'create' ? 'insert' : 'edit'}`
        var { data } = await axios.post(url, this.data)

        this.alert = {
          countDown: 10,
          type: 'success',
          message: data.message.join('\n')
        }
      } catch (error) {
        console.log(error.response.data)
        const data = error.response.data

        this.alert = {
          countDown: 10,
          type: 'danger',
          message: data.message.join('\n')
        }
      }
    }
  },
  mounted () {
  },
}
</script>

<style scoped>
.alert-message {
  margin-bottom: 0px;
}
</style>
