<template>
  <div class="sections">
    <b-alert
      v-for="alert in alerts"
      :key="alert.idx"
      :show="alert.countDown"
      dismissible
      variant="success"
      @dismissed="alert.countDown = 0"
    >
      <p class="alert-message">{{ alert.message }}</p>
    </b-alert>
    <Section title="Relatório">
      <Form justify="center">
        <VueExcelEditor v-model="jsondata" filter-row>
          <VueExcelColumn field="codigo" label="Código" />
          <VueExcelColumn field="nome" label="Nome" />
          <VueExcelColumn field="cnpj" label="Contact" />
          <VueExcelColumn field="pasta" label="Pasta" />
          <VueExcelColumn field="subpasta" label="Subpasta" />
          <VueExcelColumn field="arquivo" label="Arquivo" />
          <VueExcelColumn field="cobranca" label="Tipo Cobrança" />
          <VueExcelColumn field="competencia" label="Competência" />
          <VueExcelColumn field="envio" label="Data de Envio" />
          <VueExcelColumn field="status" label="Enviado/Pendente" />
          <VueExcelColumn field="download" label="Download" type="html" />
          <VueExcelColumn field="upload" label="Upload" />
        </VueExcelEditor>
      </Form>
    </Section>

    <b-modal
      :id="uploadModal.id"
      :title="uploadModal.title"
      class="file-modal"
      size="lg"
      ok-only
      @hide="resetInfoModal"
    >
      <UploadFiles
        @files="
          newFiles => {
            files = newFiles
          }
        "
      ></UploadFiles>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button
            class="btn btn-primary btn-apply float-right"
            @click="uploadFiles"
          >
            Salvar
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Section from '@/components/Section.vue'
import Form from '@/components/Form.vue'
import FormSelect from '@/components/FormSelect.vue'
import axios from 'axios'
import VueExcelEditor from '@/components/vue-excel-editor/VueExcelEditor.vue'
import VueExcelColumn from '@/components/vue-excel-editor/VueExcelColumn.vue'
import UploadFiles from '@/components/UploadFiles.vue'
import {
  faCloudUploadAlt,
  faClipboardList,
  faCommentDots,
  faInfoCircle,
  faFolderOpen,
  faArchive,
  faCheck
} from '@fortawesome/free-solid-svg-icons'

export default {
  data() {
    return {
      jsondata: [],
      tableData: {
        oblied: [],
        extra: []
      },
      tableDataInit: {
        oblied: [],
        extra: []
      },
      files: [],
      documents: {},
      noMovements: {},
      periodValue: '',
      companySelected: '0',
      companyOptions: [],
      uploadModal: {
        id: 'upload-modal',
        title: '',
        data: ''
      },
      alerts: []
    }
  },
  watch: {
    companySelected(newValue) {
      console.log('companySelected :>> ', newValue)
      this.filterTableData([{ companyId: newValue }])
    },
    periodValue() {
      if (this.userData.companies) this.getUserFiles()
    }
  },
  computed: {
    userData() {
      return this.$store.getters.getUserdata
    },
    tableColumns() {
      return [
        { key: 'companyId', label: 'Código', sortable: true },
        { key: 'companyName', label: 'Empresa', sortable: true },
        { key: 'companyCGCE', label: 'CPF/CPNJ', sortable: true },
        { key: 'folder', label: 'Pasta', sortable: true },
        { key: 'document', label: 'Documento', sortable: true },
        {
          key: 'actions',
          label: 'Actions',
          sortable: false,
          tdClass: 'actions'
        }
      ]
    },
    tableActions() {
        return [
            {
                id: 'hasfile',
                type: 'icon',
                content: faFolderOpen,
                action: row => console.log(row),
                title: 'Esta pasta contém arquivos',
                disabled: true
            },
            {
                id: 'upload',
                type: 'icon',
                content: faCloudUploadAlt,
                action: this.showUploadModal,
                title: 'Clique aqui para subir os arquivos'
            },
            {
                id: 'protocol',
                type: 'icon',
                content: faClipboardList,
                action: () => {},
                title: 'Clique aqui para visualizar o protocolo dos arquivos'
            },
            {
                id: 'comment',
                type: 'icon',
                content: faCommentDots,
                action: () => {},
                title: 'Clique aqui para escrever uma mensagem'
            },
            {
                id: 'info',
                type: 'icon',
                content: faInfoCircle,
                action: this.showInfoFile,
                title: 'Clique aqui para ver o arquivo de informação'
            },
            {
                id: 'archive',
                type: 'icon',
                content: faArchive,
                contentSelected: 0,
                action: this.setFolderNoMovement,
                title: 'Clique para selecionar esta pasta sem movimento'
            },
            {
                id: 'unarchive',
                type: 'icon',
                content: faCheck,
                contentSelected: 0,
                action: this.setFolderNoMovement,
                title: 'Clique para selecionar esta pasta com movimento'
            }
        ]
    },
    periodOptions() {
      const currentDate = new Date()
      const options = []
      for (let i = 1; i <= 12; i++) {
        options.push({
          key: i,
          value: String(currentDate.getFullYear()) + String(i).padStart(2, '0'),
          name:
            String(i).padStart(2, '0') + '/' + String(currentDate.getFullYear())
        })
      }

      return options
    }
  },
  methods: {
    checkForUserData() {
      if (this.userData.companies) {
        this.getUserFiles()
        this.setCompanyOptions()
      } else {
        setTimeout(this.checkForUserData, 100)
      }
    },
    getUserDocuments() {
      const userData = this.userData
      this.tableData = {
        oblied: [],
        extra: []
      }

      userData.companies.forEach(company => {
        const companyId = company[0]

        for (const type in userData.documents) {
          this.setUserDocumentsByType(userData, company, companyId, type)
        }
      })

      this.tableDataInit = this.tableData
    },
    setUserDocumentsByType(userData, company, companyId, type) {
      if (companyId in userData.documents[type]) {
        const tableData = this.tableData
        const documents = this.documents
        const noMovements = this.noMovements

        userData.documents[type][companyId].forEach(document => {
          const documentPath = document.split('/')

          const noMovement =
            companyId in noMovements
              ? document in noMovements[companyId] &&
                noMovements[companyId][document]
                ? true
                : false
              : false

          const hasfile =
            companyId in documents
              ? document in documents[companyId] &&
                documents[companyId][document].length > 0
                ? true
                : false
              : false

          tableData[type].push({
            companyId: companyId,
            companyName: company[1],
            companyCGCE: company[2],
            folder: documentPath[documentPath.length - 2],
            document: documentPath[documentPath.length - 1],
            documentPath: document,
            hasfile,
            noMovement
          })
        })

        this.tableData = tableData
      }
    },
    showUploadModal(row, button) {
      console.log('row :>> ', row)
      this.uploadModal.title = `Documento: ${row.item.document}`
      this.uploadModal.data = row.item
      this.$root.$emit('bv::show::modal', this.uploadModal.id, button)
    },
    showInfoFile(row) {
      axios
        .get(
          `http://${location.hostname}:2160/users/checkinfo?path=${row.item.documentPath}`
        )
        .then(response => {
          console.log('response :>> ', response)

          if (response.data.ok)
            window.open(
              `http://${location.hostname}:2160/users/info?path=${response.data.path}&mimetype=${response.data.mimetype}`
            )
          else alert(response.data.message)
        })
        .catch(error => {
          console.error(error)
        })
    },
    resetInfoModal() {
      this.uploadModal.title = ''
      this.uploadModal.content = ''
    },
    uploadFiles() {
      // console.log('this.files :>> ', this.files)
      const formData = new FormData()

      formData.append('companyId', this.uploadModal.data.companyId)
      formData.append('documentPath', this.uploadModal.data.documentPath)
      formData.append('period', this.getPeriodName(this.periodValue))
      this.files.forEach((f, i) => formData.append('files', this.files[i].file))
      // console.log('formData.getAll("files") :>> ', formData.getAll('files'))

      const self = this
      axios({
        method: 'post',
        url: `http://${location.hostname}:2160/users/documents`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          console.log(response)
          const companyId = parseInt(formData.get('companyId'))
          const documentPath = formData.get('documentPath')
          this.updateDocuments(formData)
          this.updateTableData({ companyId, documentPath })

          this.$bvModal.hide(this.uploadModal.id)

          self.$root.$children[0].alert.message =
            'Arquivos inseridos com sucesso!'
          self.$root.$children[0].alert.show = true
        })
        .catch(error => {
          console.log('error.response :>> ', error.response)
          console.error('Erro ao subir os arquivos!')
        })
    },
    getCurrentPeriod() {
      const currentDate = new Date()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      return String(currentDate.getFullYear()) + month
    },
    getPeriodName(periodValue) {
      const period = this.periodOptions.filter(p => p.value === periodValue)
      return period[0].name
    },
    setCompanyOptions() {
      this.companyOptions = [
        {
          key: 0,
          value: '',
          name: 'Selecionar empresa',
          disabled: true
        }
      ]

      this.userData.companies.forEach(company => {
        this.companyOptions.push({
          key: company[0],
          value: company[0],
          name: company[1] + ' - ' + company[2]
        })
      })
    },
    filterTableData(values) {
      const tableDataInit = this.tableDataInit
      const tableData = {
        oblied: [],
        extra: []
      }

      values.forEach(val => {
        for (const key in val) {
          tableDataInit.oblied.forEach(data =>
            data[key] == val[key] ? tableData.oblied.push(data) : null
          )
          tableDataInit.extra.forEach(data =>
            data[key] == val[key] ? tableData.extra.push(data) : null
          )
        }
      })

      this.tableData = tableData
    },
    setFolderNoMovement(row) {
      axios
        .post(`http://${location.hostname}:2160/users/no-movement`, {
          noMovement: row.item.noMovement,
          documentPath: row.item.documentPath,
          companyId: row.item.companyId,
          period: this.periodValue
        })
        .then(response => {
          console.log('response :>> ', response)
          const data = response.data.data

          this.updateTableData(data)
        })
        .catch(error => {
          console.error('error :>> ', error)
        })
    },
    getUserFiles() {
      const companyIds =
        '?companyIds=' + this.userData.companies.map(data => data[0]).join(',')
      const period = 'period=' + this.periodValue
      const params = [companyIds, period].join('&')

      axios
        .get(`http://${location.hostname}:2160/users/files${params}`)
        .then(response => {
          console.log(response)

          this.documents = response.data.data.files
          this.noMovements = response.data.data.noMovements

          this.getUserDocuments()
        })
        .catch(error => {
          console.error(error)
        })
    },
    updateDocuments(formData) {
      const companyId = parseInt(formData.get('companyId'))
      const documentPath = formData.get('documentPath')
      const files = formData.getAll('files')

      if (!(companyId in this.documents)) {
        this.documents[companyId] = {}
      }
      if (!(documentPath in this.documents[companyId])) {
        this.documents[companyId][documentPath] = []
      }

      for (let i = 0; i < files.length; i++) {
        this.documents[companyId][documentPath].push(files[i].name)
      }
    },
    updateTableData(params) {
      const tableData = JSON.parse(JSON.stringify(this.tableData))
      const documents = this.documents

      for (const table in tableData) {
        if (table == 'oblied' || table == 'extra') {
          tableData[table].forEach(row => {
            if (
              row.companyId === params.companyId &&
              row.documentPath === params.documentPath
            ) {
              row.noMovement =
                'noMovement' in params
                  ? params.noMovement
                  : 'noMovement' in row
                  ? row.noMovement
                  : false

              row.hasfile =
                row.companyId in documents
                  ? row.documentPath in documents[row.companyId] &&
                    documents[row.companyId][row.documentPath].length > 0
                    ? true
                    : false
                  : false
            }
          })
        }
      }

      this.tableData = tableData
    },
    alertNoMovement() {
      // const alert = {
      //   idx: this.alerts.length,
      //   countDown: 5
      // }
      // if (noMovement.is) alert.message = `Documento ${noMovement.document} da empresa ${noMovement.companyId} selecionado como sem movimento!`
      // else alert.message = `Documento ${noMovement.document} da empresa ${noMovement.companyId} selecionado como com movimento!`
      // this.alerts.push(alert)
    },
    loadDefaultReportData() {
      this.jsondata = [
        {
          codigo: '43',
          nome: 'FAATECH',
          cnpj: '00000000000000',
          pasta: 'Contábil',
          subpasta: 'Extratos Bancários',
          arquivo: 'BANCO DO ITAU AG 7138 CC 06757-9',
          cobranca: 'Obrigatório',
          competencia: '11/2020',
          envio: '10/11/2020',
          status: 'Enviado',
          download:
            '<button type="button" class="btn btn-download"><font-awesome-icon icon="user-secret"></font-awesome-icon></button>',
          upload: ''
        },
        {
          codigo: '48',
          nome: 'FAATECH',
          cnpj: '00000000000000',
          pasta: 'Contábil',
          subpasta: 'Extratos Bancários',
          arquivo: 'BANCO DO ITAU AG 7138 CC 06757-9',
          cobranca: 'Obrigatório',
          competencia: '11/2020',
          envio: '17/11/2020',
          status: 'Enviado',
          download: '<p style="color:#ff2200;">Oioioi</p>',
          upload: ''
        },
        {
          codigo: '1418',
          nome: 'DIVIART',
          cnpj: '00000000000000',
          pasta: 'Contábil',
          subpasta: 'Extratos Bancários',
          arquivo: 'Itaú',
          cobranca: 'Obrigatório',
          competencia: '10/2020',
          envio: '04/11/2020',
          status: 'Enviado',
          download: '<p style="color:#ff2200;">Oioioi</p>',
          upload: ''
        }
      ]
    }
  },
  created() {},
  mounted() {
    this.checkForUserData()
    this.periodValue = this.getCurrentPeriod()
    this.loadDefaultReportData()
  },
  components: {
    Section,
    Form,
    FormSelect,
    VueExcelEditor,
    VueExcelColumn,
    UploadFiles
  }
}
</script>

<style lang="scss">
table.table {
  td.actions > div:first-child {
    display: flex;
  }
  button.btn-hasfile {
    color: #111111;
    cursor: default;
    border-color: transparent;
    background-color: transparent;
  }
  button.btn-upload {
    border-color: #17a2b8;
    background-color: #17a2b8;
  }
  button.btn-protocol {
    border-color: #28a745;
    background-color: #28a745;
  }
  button.btn-info {
    border-color: #fd7e14;
    background-color: #fd7e14;
  }
  button.btn-comment {
    border-color: #6f42c1;
    background-color: #6f42c1;
  }
  button.btn-archive {
    border-color: #dc3545;
    background-color: #dc3545;
  }
  button.btn-archive.no-movement {
    display: none;
  }
  button.btn-unarchive {
    display: none;
    border-color: #dc3545;
    background-color: #dc3545;
  }
  button.btn-unarchive.no-movement {
    display: inline-block;
  }
  button.btn-upload:active,
  button.btn-protocol:active,
  button.btn-info:active,
  button.btn-comment:active,
  button.btn-archive:active {
    background-color: #6c757d !important;
  }
}
button.btn {
  padding: 2px 4px !important;
}

div.modal {
  div.modal-body {
    padding: 0px;
    min-height: 200px;
    max-height: 70vh;
    overflow-x: auto;
    background-color: #eee;
  }

  footer.modal-footer {
    button.btn {
      box-shadow: 0px 2px 4px 0px #888888 !important;
    }
    button.btn:hover {
      transform: translateY(-1px);
      box-shadow: 0px 2px 4px 1px #888888 !important;
    }
    button.btn-apply {
      background-color: #276485;
      border-color: #276485;
    }
  }
}
</style>
