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
    <Section title="Cadastro" class="mb-2">
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
        <table-companies
          ref="tableCompanies"
          col-size="12"
          selector-id="company-selector"
          label="Empresas selecionadas"
          :content="data.companies"
          @content-change="(newContent) => {data.companies = newContent}" >
        </table-companies>
        <table-documents
          ref="tableDocuments"
          col-size="12"
          selector-id="docs-selector"
          label="Documentos selecionados"
          :companies-content="data.companies"
          @content-change="(newContent) => {data.documents = newContent}" >
        </table-documents>
        <!-- <div class="col-12">
          <datatable
            :columns="table.columns"
            :data="tabledata"
            :buttons="table.actions"
            ref-id="table-extra"
            class="mt-4"
          >
          </datatable>
        </div> -->
        <div class="col-12 mt-3 d-flex justify-content-center align-items-center">
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
import axios from 'axios'
import Section from '@/components/Section.vue'
import Form from '@/components/Form.vue'
import FormInput from '@/components/FormInput.vue'
import TableCompanies from '@/components/TableCompanies.vue'
import TableDocuments from '@/components/TableDocuments.vue'
import {
  faSearch,
  faEdit
} from '@fortawesome/free-solid-svg-icons'
export default {
  components: {
    Section,
    Form,
    FormInput,
    TableCompanies,
    TableDocuments
  },
  data() {
    return {
      alert: {
        countDown: 0,
        type: null,
        message: null
      },
      data: {
        name: null,
        email: null,
        username: null,
        password: null
      },
      tabledata: [],
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
      loading: false,
      superId: null
    }
  },
  computed: {
    baseURL() {
      return `${this.$root.serverURL}/users`
    },
    pageType() {
      return this.$route.params.username ? 'edit' : 'create'
    },
    icons() {
      return {
        faSearch
      }
    },
    table() {
      return {
        columns: [
          { key: 'name', label: 'Nome', sortable: true },
          { key: 'email', label: 'E-mail', sortable: true },
          { key: 'username', label: 'Nome de usuário', sortable: true },
          {
            key: 'actions',
            label: 'Ação',
            sortable: false,
            tdClass: 'actions',
          }
        ],
        actions: [
          {
            id: 'success p-1 btn-sm',
            type: 'icon',
            content: faEdit,
            action: row => this.editUser(row),
            title: 'Editar usuário',
          }
        ]
      }
    }
  },
  methods: {
    editUser(row) {
      this.data = {
        name: row.item.name,
        email: row.item.email,
        username: row.item.username,
        password: ''
      }
    },

    async save(event) {
      event.preventDefault()
      event.stopPropagation()

      try {
        this.data.superId = this.superId
        const url = `${this.baseURL}/${this.pageType == 'create' ? 'insert' : 'edit'}`
        var { data } = await axios.post(url, this.data)

        delete this.data.superId

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
    this.superId = this.$store.getters.getUserdata._id
  },
}
</script>

<style scoped>
.alert-message {
  margin-bottom: 0px;
}
#insert-section .col-6,
#insert-section .col-4 {
  margin-bottom: 8px;
}
</style>
