<template>
  <div class="sections">
    <Section title="Documentos Obrigatórios">
      <Form justify="end">
        <FormSelect
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
        <Datatable
          :columns="tableColumns"
          :data="tableData"
          :buttons="tableActions"
        >
        </Datatable>
      </Form>

      <!-- Info modal -->
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
    </Section>
  </div>
</template>

<script>
import Section from '@/components/Section.vue'
import Form from '@/components/Form.vue'
import FormSelect from '@/components/FormSelect.vue'
import axios from 'axios'
import Datatable from '@/components/Datatable.vue'
import UploadFiles from '@/components/UploadFiles.vue'
import {
  faCloudUploadAlt,
  faClipboardList,
  faCommentDots,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'

export default {
  data() {
    return {
      tableData: [],
      files: [],
      periodValue: '',
      uploadModal: {
        id: 'upload-modal',
        title: '',
        data: ''
      }
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
        { key: 'actions', label: 'Actions', sortable: false }
      ]
    },
    tableActions() {
      return [
        {
          id: 'upload',
          type: 'icon',
          content: faCloudUploadAlt,
          action: this.showUploadModal
        },
        {
          id: 'protocol',
          type: 'icon',
          content: faClipboardList,
          action: () => {}
        },
        {
          id: 'comment',
          type: 'icon',
          content: faCommentDots,
          action: () => {}
        },
        {
          id: 'info',
          type: 'icon',
          content: faInfoCircle,
          action: () => {}
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
        this.getUserDocuments()
      } else {
        setTimeout(this.checkForUserData, 100)
      }
    },
    getUserDocuments() {
      this.tableData = []
      const userData = this.userData
      userData.companies.forEach(company => {
        const companyId = company[0]
        userData.documents[companyId].forEach(document => {
          const documentPath = document.split('/')
          this.tableData.push({
            companyId: companyId,
            companyName: company[1],
            companyCGCE: company[2],
            folder: documentPath[documentPath.length - 2],
            document: documentPath[documentPath.length - 1],
            documentPath: document
          })
        })
      })
    },
    showUploadModal(row, button) {
      console.log('row :>> ', row)
      this.uploadModal.title = `Documento: ${row.item.document}`
      this.uploadModal.data = row.item
      this.$root.$emit('bv::show::modal', this.uploadModal.id, button)
    },
    resetInfoModal() {
      this.uploadModal.title = ''
      this.uploadModal.content = ''
    },
    uploadFiles() {
      console.log('this.files :>> ', this.files)
      const formData = new FormData()

      formData.append('companyId', this.uploadModal.data.companyId)
      formData.append('documentPath', this.uploadModal.data.documentPath)
      formData.append('period', this.getPeriodName(this.periodValue))
      this.files.forEach((f, i) => formData.append('files', this.files[i].file))
      console.log('formData.getAll("files") :>> ', formData.getAll('files'))

      const self = this
      axios({
        method: 'post',
        url: `http://${location.hostname}:2160/users/documents`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          console.log(response)
          this.$bvModal.hide(this.uploadModal.id)

          self.$root.$children[0].alert.message = 'Arquivos inseridos com sucesso!'
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
    UploadFiles
  }
}
</script>

<style lang="scss">
table.table {
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
  button.btn-upload:active,
  button.btn-protocol:active,
  button.btn-info:active,
  button.btn-comment:active {
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
