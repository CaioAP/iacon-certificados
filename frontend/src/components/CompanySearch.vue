<template>
  <div class="modal fade" :id="modalId" tabindex="-1" role="dialog" :aria-labelledby="label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="label">{{title}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <section-modal
                :flex="true"
                f-justify="center"
                f-align="center" >
                <form-input
                  col-size="2"
                  label-text="Código"
                  input-type="number"
                  input-id="input-code"
                  input-name="code"
                  v-model="filter.code"
                ></form-input>
                <form-input
                  col-size="6"
                  label-text="Nome da empresa"
                  input-type="text"
                  input-id="input-name"
                  input-name="name"
                  v-model="filter.name"
                ></form-input>
                <form-input
                  col-size="4"
                  input-type="text"
                  input-id="filter-cgce"
                  v-model="filter.cgce"
                  label-text="CPF/CNPJ"
                ></form-input>
              </section-modal>
            </div>
            <div class="row">
              <div class="col-12">
                <datatable
                  :columns="table.columns"
                  :data="filtered"
                  ref-id="tableCompanies"
                  class="mt-4"
                  selectable
                  @row-selected="onRowSelected"
                >
                </datatable>
                <table :id="`table-${modalId}`" class="table table-hover table-selectable table-responsive-md hover stripe" width="100%"></table>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-dismiss="modal">Fechar</button>
          <button
            type="button"
            class="btn btn-apply"
            data-dismiss="modal"
            @click="loadCompaniesSelected"
          > 
            Carregar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import SectionModal from '@/components/SectionModal.vue'
import FormInput from '@/components/FormInput.vue'
import Datatable from '@/components/Datatable.vue'
export default {
  components: {
    SectionModal,
    FormInput,
    Datatable
  },
  props: {
    modalId: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    selectedCompanies: {
      type: Array,
      default: () => []
    },
    remove: {
      type: Number,
      default: null
    }
  },
  computed: {
    table() {
      return {
        columns: [
          { key: 'codigo', label: 'Código', sortable: true },
          { key: 'nome', label: 'Nome', sortable: true },
          { key: 'username', label: 'CPF/CNPJ', sortable: true, 
            formatter: (value) => {
              return this.formatarCNPJ(value)
            }
          },
        ]
      }
    }
  },
  data() {
    return {
      filter: {
        code: '',
        name: '',
        cgce: ''
      },
      filtered: [],
      companies: [],
      selected: []
    }
  },
  watch: {
    'filter.code'(code) {
      this.filterCompaniesTable('codigo', code)
    },
    'filter.name'(name) {
      this.filterCompaniesTable('nome', name)
    },
    'filter.cgce'(cgce) {
      this.filterCompaniesTable('cnpj', cgce)
    },
    remove(code) {
      let rmIdx
      for (let i = 0; i < this.table.rows('.selected').data().length; i++) {
        const selected = this.table.rows('.selected').data()[i]
        if (selected.codigo === code) {
          rmIdx = i
          break
        }
      }
      const rowIdx = this.table.rows('.selected')[0][rmIdx]
      this.table.row(rowIdx).deselect()
    }
  },
  methods: {
    formatarCNPJ(cnpj) {
      cnpj = cnpj.replace(/(\.|\/|-)/g, '')
      if (cnpj.length == 14) {
        const part1 = cnpj.substr(0, 2)
        const part2 = cnpj.substr(2, 3)
        const part3 = cnpj.substr(5, 3)
        const part4 = cnpj.substr(8, 4)
        const part5 = cnpj.substr(12, 2)
        cnpj = `${part1}.${part2}.${part3}/${part4}-${part5}`
        
        return cnpj
      } else if (cnpj.length == 12) {
        const part1 = cnpj.substr(0, 2)
        const part2 = cnpj.substr(2, 3)
        const part3 = cnpj.substr(5, 5)
        const part4 = cnpj.substr(10, 2)
        cnpj = `${part1}.${part2}.${part3}/${part4}`

        return cnpj
      } else if (cnpj.length == 11) {
        const part1 = cnpj.substr(0, 3)
        const part2 = cnpj.substr(3, 3)
        const part3 = cnpj.substr(6, 3)
        const part4 = cnpj.substr(9, 2)
        cnpj = `${part1}.${part2}.${part3}-${part4}`

        return cnpj
      } else {
        return cnpj
      }
    },
    onRowSelected(items) {
      this.selected = items
    },
    filterCompaniesTable(attr, data) {
      data = data.toUpperCase()
      this.filtered = this.companies.filter(company => String(company[attr]).indexOf(data) > -1 )
    },
    loadCompaniesTableData() {
      axios.get('/empresas')
        .then(response => {
          this.companies = response.data
          this.filtered = response.data
          
          if (this.companies.length > 0) this.$refs.tableCompanies.selectRow(0)
        })
        .catch(error => {
          console.log('error :>> ', error);
        })
    },
    loadCompaniesSelected() {
      const selected = this.selected
      
      for (let i = 0; i < selected.length; i++) {
        const sel = selected[i]
        if (this.selectedCompanies.filter(company => company.codigo === sel.codigo).length === 0)
          this.selectedCompanies.push(sel)
      }

      this.$emit('selection', this.selectedCompanies)
    }
  },
  mounted() {
    this.loadCompaniesTableData()
  }
}
</script>

<style scoped>
  div.modal div.modal-dialog {
    min-width: 800px;
  }
  div.modal div.modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  i {
    font-size: 28px;
  }
  table.table-selectable tr:hover {
    cursor: pointer;
  }
</style>