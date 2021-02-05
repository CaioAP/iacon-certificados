<template>
  <Section title="Filtro">
    <Form justify="start">
      <div class="col-12 d-flex justify-content-end">
        <button 
          type="submit"
          class="btn btn-primary"
          @click="search"
        >
          <font-awesome-icon :icon="icons.faSearch" />
          Pesquisar
        </button>
      </div>
      <form-input
        col-size="4"
        input-type="text"
        input-id="filter-name"
        v-model="filter.name"
        label-text="Nome"
      ></form-input>
      <form-input
        col-size="4"
        input-type="text"
        input-id="filter-email"
        v-model="filter.email"
        label-text="E-mail"
      ></form-input>
      <form-input
        col-size="4"
        input-type="text"
        input-id="filter-username"
        v-model="filter.username"
        label-text="Nome de usuário"
      ></form-input>
      
      <datatable
        :columns="table.columns"
        :data="tabledata"
        :buttons="table.actions"
        ref-id="table-extra"
        class="mt-4"
      >
      </datatable>
    </Form>
  </Section>
</template>

<script>
import axios from 'axios'
import Section from '@/components/Section.vue'
import Form from '@/components/Form.vue'
import FormInput from '@/components/FormInput.vue'
import Datatable from '@/components/Datatable.vue'
import {
  faEdit
} from '@fortawesome/free-solid-svg-icons'
export default {
  components: {
    Section,
    Form,
    FormInput,
    Datatable
  },
  data() {
    return {
      filter: {
        name: null,
        email: null,
        username: null
      },
      tabledata: [],
    }
  },
  computed: {
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
      console.log(row)
    },

    async search(event) {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }

      try {
        let url = `${this.baseURL}/pesquisar?superId=${this.superId}`
        if (this.filter.name)
          url += `&name=${this.filter.name}`
        if (this.filter.email)
          url += `&email=${this.filter.email}`
        if (this.filter.username)
          url += `&username=${this.filter.username}`
          
        console.log('url :>> ', url);
        var { data } = await axios.get(url)
        this.tabledata = data.data
        console.log('data :>> ', data)
        
      } catch (error) {
        console.log(error.response.data)
        const data = error.response.data

        this.alert = {
          countDown: 10,
          type: 'danger',
          message: data.message.join('\n')
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>