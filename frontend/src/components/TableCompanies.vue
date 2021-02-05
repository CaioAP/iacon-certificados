<template>
  <div :class="'col-' + colSize">
    <label :for="selectorId">
      {{label}}
    </label>
    <Table
      :table-id="selectorId"
      :headers="table.headers"
      :contents="table.contents"
      button-modal-id="company-search"
      @remove="(rmIdx) => {remove = rmIdx; elementRemoved = table.contents[rmIdx];}"
    ></Table>
    <company-search
      modal-id="company-search"
      label="company-search-title"
      title="Buscar empresas"
      :selected-companies="table.contentsListObj"
      @selection="(newVal) => {data = newVal}"
      :remove="elementRemoved !== null ? elementRemoved[0] : null"
    ></company-search>
  </div>
</template>

<script>
import Table from '@/components/Table.vue'
import CompanySearch from '@/components/CompanySearch.vue'
export default {
  components: {
    Table,
    CompanySearch,
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
    content: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      table: {
        headers: [
          {title: 'Codigo', width: '10%'},
          {title: 'Empresa', width: '65%'},
          {title: 'CPF/CNPJ', width: '20%'}
        ],
        contents: [],
        contentsListObj: []
      },
      mostrarModal: false,
      data: [],
      remove: -1,
      elementRemoved: null
    }
  },
  watch: {
    data(newData) {
      this.table.contents.splice(0, this.table.contents.length)
      newData.forEach(dt => {
        this.table.contents.push([
          dt.codigo, 
          dt.nome, 
          this.formatCNPJ(dt.cnpj)
        ])
      })
      this.orderContent()
      this.emitContentChange()
    },
    remove(rmIdx) {
      if (rmIdx !== -1) this.table.contents.splice(rmIdx, 1)
      this.emitContentChange()
    },
    content(newContent) {
      this.table.contents = newContent

      this.table.contentsListObj = []
      newContent.forEach(cont => {
        this.table.contentsListObj.push({
          codigo: cont[0],
          nome: cont[1],
          cnpj: cont[2]
        })
      })
    }
  },
  methods: {
    emitContentChange() {
      this.$emit('content-change', this.table.contents)
    },
    orderContent(){
      this.table.contents.sort((a, b) => {
        if (a[0] < b[0]) return -1
        if (a[0] > b[0]) return 1
        return 0
      })
    },
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
    }
  },
  mounted() {}
}
</script>
