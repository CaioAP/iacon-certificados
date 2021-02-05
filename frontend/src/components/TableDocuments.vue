<template>
  <div :class="'tables-docs col-' + colSize">
    <div class="row">
      <div class="col-6">
        <label :for="selectorId">Documentos obrigatórios</label>
        <Table
          :table-id="selectorId + '-1'"
          :headers="table.headers"
          :contents="table.contents.oblied"
          :button-add-show="false"
          :button-del-show="false"
          button-modal-id="company-search"
        ></Table>
      </div>
      <div class="col-6">
        <label :for="selectorId">Documentos extras</label>
        <Table
          :table-id="selectorId + '-2'"
          :headers="table.headers"
          :contents="table.contents.extra"
          :button-add-show="false"
          :button-del-show="false"
          button-modal-id="company-search"
        ></Table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Table from '@/components/Table.vue'
export default {
  components: {
    Table
  },
  props: {
    colSize: {
      type: String,
      default: '2'
    },
    selectorId: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    companiesContent: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      table: {
        headers: [
          // {title: 'Codigo', width: '10%'},
          {title: 'Empresa', width: '15%'},
          {title: 'Pastas', width: '85%'}
        ],
        contents: {
          oblied: [],
          extra: []
        }
      },
      data: [],
      companiesNames: {}
    }
  },
  watch: {
    data(newData) {
      this.table.contents.oblied.splice(0, this.table.contents.oblied.length)
      this.table.contents.extra.splice(0, this.table.contents.extra.length)
      newData.forEach(dt => {
        if (!('oblied' in dt)) dt.oblied = []
        if (!('extra' in dt)) dt.extra = []
        
        dt.oblied.forEach(oblied => {
          this.table.contents.oblied.push([
            dt.companyId,
            oblied
          ])
        })
        dt.extra.forEach(extra => {
          this.table.contents.extra.push([
            dt.companyId,
            extra
          ])
        })
      })
      this.emitContentChange()
    },
    remove(rmIdx) {
      if (rmIdx !== -1) this.table.contents.splice(rmIdx, 1)
      this.emitContentChange()
    },
    companiesContent(newContent) {
      this.setCompaniesNames(newContent)
      const companies = newContent.map(content => content[0])
      this.getCompaniesFolders(companies)
    },
  },
  methods: {
    emitContentChange() {
      this.orderContent()
      this.$emit('content-change', this.table.contents)
    },
    getCompaniesFolders(companies) {
      axios.get('/empresas/folders?companies=' + companies.join(','))
        .then(response => {
          this.data = response.data
        })
        .catch(error => {
          console.log('error :>> ', error)
        })
    },
    setCompaniesNames(companies) {
      companies.forEach(company => {
        this.companiesNames[company[0]] = company[1]
      })
    },
    orderContent(){
      this.table.contents.oblied.sort((a, b) => {
        if (a[0] < b[0]) return -1
        if (a[0] > b[0]) return 1
        return 0
      })
      this.table.contents.extra.sort((a, b) => {
        if (a[0] < b[0]) return -1
        if (a[0] > b[0]) return 1
        return 0
      })
    }
  },
}
</script>

<style scoped>
.tables-docs {
  margin-top: 1rem;
}
</style>