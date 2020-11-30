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
      <p class="alert-message">{{alert.message}}</p>
    </b-alert>
    <Section title="Filtro">
      <Form justify="start">
        <FormSelect
          classes="no-bottom-margin"
          col-size="4"
          label-text="Empresa"
          input-id="select-company"
          :options="companyOptions"
          :value="companySelected"
          @change="
            newValue => {
              companySelected = newValue
            }
          "
        ></FormSelect>

        <FormSelect
          classes="no-bottom-margin"
          col-size="2"
          label-text="Período"
          input-id="select-period"
          :options="periodOptions"
          :value="periodValue"
          @change="
            newValue => {
              periodValue = newValue
            }
          "
        ></FormSelect>
      </Form>
    </Section>

    <Section title="Documentos Obrigatórios">
      <Form justify="center">
        <Datatable
          :columns="tableColumns"
          :data="tableData.oblied"
          :buttons="tableActions"
          ref-id="table-oblied"
        >
        </Datatable>
      </Form>
    </Section>

    <Section title="Documentos Extras">
      <Form justify="center">
        <Datatable
          :columns="tableColumns"
          :data="tableData.extra"
          :buttons="tableActions"
          ref-id="table-extra"
        >
        </Datatable>
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

    <b-modal
      :id="messageModal.id"
      :title="messageModal.title + ' - ' + formatPeriod(periodValue)"
      class="message-modal"
      size="lg"
      ok-only
      scrollable
      @hide="resetInfoModal"
    >
      <MessageCard 
        v-for="(message, index) in messageModal.messages" 
        :key="index"
        :fullname="message.fullname"
        :text="message.text"
        :datetime="message.datetime"
        :usertype="message.usertype"
        :my-message="message.myMessage"
      >
      </MessageCard>
      <template v-slot:modal-footer>
        <div class="w-100">
          <Form justify="between">
            <div class="col-11">
              <input 
                type="text" 
                name="message" 
                id="input-message" 
                class="form-control input-message"
                placeholder="Digite uma mensagem"
                v-model="messageModal.input"
              >
            </div>
            <div class="col-1">
              <button
                type="submit"
                class="btn btn-primary btn-send"
                @click="sendMessage"
              >
                <font-awesome-icon :icon="icons.faPaperPlane" size="lg"/>
              </button>
            </div>
          </Form>
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
import Datatable from '@/components/Datatable.vue'
import UploadFiles from '@/components/UploadFiles.vue'
import MessageCard from '@/components/MessageCard.vue'
import {
  faCloudUploadAlt,
  faClipboardList,
  faCommentDots,
  faInfoCircle,
  faFolderOpen,
  faArchive,
  faCheck,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons'

export default {
  data() {
    return {
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
      messageModal: {
        id: 'message-modal',
        title: '',
        data: '',
        input: '',
        usertype: 'client',
        messages: []
      },
      alerts: [],
      icons: {
        faCloudUploadAlt,
        faClipboardList,
        faCommentDots,
        faInfoCircle,
        faFolderOpen,
        faArchive,
        faCheck,
        faPaperPlane
      },
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
        { key: 'actions', label: 'Actions', sortable: false, tdClass: 'actions' }
      ]
    },
    tableActions() {
      return [
        {
          id: 'hasfile',
          type: 'icon',
          content: faFolderOpen,
          action: (row) => console.log(row),
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
          action: this.showMessageModal,
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
          
          const noMovement = companyId in noMovements
            ? document in noMovements[companyId]
            && noMovements[companyId][document]
              ? true
              : false
            : false

          const hasfile = companyId in documents 
            ? document in documents[companyId] 
            && documents[companyId][document].length > 0
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
      axios.get(`http://${location.hostname}:2160/users/checkinfo?path=${row.item.documentPath}`)
        .then( response => {
          console.log('response :>> ', response)

          if (response.data.ok)
            window.open(`http://${location.hostname}:2160/users/info?path=${response.data.path}&mimetype=${response.data.mimetype}`)
          else
            alert(response.data.message)
        })
        .catch( error => {
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
          this.updateTableData({companyId, documentPath})

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
          tableDataInit.oblied.forEach(
            data => data[key] == val[key] ? tableData.oblied.push(data) : null
          )
          tableDataInit.extra.forEach(
            data => data[key] == val[key] ? tableData.extra.push(data) : null
          )
        }
      })

      this.tableData = tableData
    },
    setFolderNoMovement(row) {
      axios.post(`http://${location.hostname}:2160/users/no-movement`, { 
        noMovement: row.item.noMovement,
        documentPath: row.item.documentPath,
        companyId: row.item.companyId,
        period: this.periodValue
      }).then( response => {
        console.log('response :>> ', response)
        const data = response.data.data

        this.updateTableData(data)
      }).catch( error => {
        console.error('error :>> ', error)
      })
    },
    getUserFiles() {
      const companyIds = '?companyIds=' + this.userData.companies.map(data => data[0]).join(',')
      const period = 'period=' + this.periodValue
      const params = [companyIds, period].join('&')
      
      axios.get(`http://${location.hostname}:2160/users/files${params}`)
        .then( response => {
          console.log(response)
          
          this.documents = response.data.data.files
          this.noMovements = response.data.data.noMovements

          this.getUserDocuments()
        })
        .catch( error => {
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
              row.companyId === params.companyId 
              && row.documentPath === params.documentPath
            ) {
              row.noMovement = 'noMovement' in params 
                ? params.noMovement
                : 'noMovement' in row
                  ? row.noMovement
                  : false

              row.hasfile = row.companyId in documents 
                ? row.documentPath in documents[row.companyId]
                && documents[row.companyId][row.documentPath].length > 0
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
    showMessageModal(row, button) {
      this.messageModal.messages = []

      axios.get(
        `http://${location.hostname}:2160/users/message?companyId=${row.item.companyId}&period=${this.periodValue}&documentPath=${row.item.documentPath}`
      ).then( response => {
        const messageModal = this.messageModal
        response.data.result.forEach(message => {
          message.datetime = new Date(message.datetime)
          message.myMessage = message.usertype === messageModal.usertype
            ? true
            : false

          this.messageModal.messages.push(message)
        })

        this.messageModal.title = `Documento: ${row.item.document}`
        this.messageModal.data = row.item
        this.$root.$emit('bv::show::modal', this.messageModal.id, button)
      }).catch( error => {
        console.error(error);
      })
    },
    sendMessage(event) {
      event.preventDefault()
      event.stopPropagation()

      const data = {
        companyId: this.messageModal.data.companyId,
        documentPath: this.messageModal.data.documentPath,
        period: this.periodValue,
        fullname: this.$store.getters.getUserdata.name,
        username: this.$store.getters.getUserdata.username,
        text: this.messageModal.input,
        datetime: new Date(),
        usertype: this.messageModal.usertype,
        myMessage: true
      }

      axios.post(`http://${location.hostname}:2160/users/message`, data)
        .then( response => {
          console.log('response.data :>> ', response.data)
          if (response.data.ok) this.messageModal.messages.push(data)
        })
        .catch( error => {
          console.error(error)
        })

      this.messageModal.input = ''
    },
    formatPeriod(period) {
      const year = period.substr(0, 4)
      const month = period.substr(4, 2)
      return `${month}/${year}`
    }
  },
  created() {},
  mounted() {
    this.checkForUserData()
    this.periodValue = this.getCurrentPeriod()
  },
  components: {
    Section,
    Form,
    FormSelect,
    Datatable,
    UploadFiles,
    MessageCard
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

div#message-modal {
  .modal-dialog {
    max-height: 90%;

    .modal-body {
      display: flex;
      flex-direction: column;
    }

    .modal-footer {
      padding: 0px;
    }

    button.btn-send {
      background-color: transparent;
      border-color: transparent;
      box-shadow: none !important;
      color: #276485;
    }
  }
}
</style>
