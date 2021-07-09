<template>
  <section class="page container">
    <h2 class="title">Certificados</h2>
    <div class="content">
      <certificate
        v-for="certificate in certificates"
        :key="certificate._id"
        :id="certificate._id"
        :user-name="certificate.userName"
        :certificate-name="certificate.name"
        :size="certificate.size"
        :inserted-at="new Date(certificate.insertedAt)"
        :expiration="new Date(certificate.expiration)"
      ></certificate>
      <p class="no-certificates" v-if="!certificates.length">
        Você ainda não possui um certificado!
      </p>
    </div>
    <hr />
    <validation-observer
      ref="formulario"
      v-slot="{ validate, invalid }"
      tag="div"
      class="form-files"
      v-if="!isUserAdmin"
    >
      <form class="files" @submit.prevent="validate().then(addCertificates)">
        <form-file v-model="certificateFiles" accept=".pfx" multiple required />
        <div class="files-certificate">
          <div
            class="card card-certificate-file"
            :class="validated[idx] ? 'valid' : 'invalid'"
            v-for="(file, idx) in certificateFiles"
            :key="idx"
            :ref="'file-certificate-' + idx"
          >
            <span class="icon">
              <fa :icon="validated[idx] ? 'check' : 'times'" />
            </span>
            <div class="card-content">
              <p class="certificate-name">{{ file.name }}</p>
              <div class="input-certificate d-flex">
                <form-input
                  type="password"
                  v-model="file.password"
                  :state="!!file.password"
                  placeholder="Senha do certificado"
                  class="input-certificate-password"
                  required
                />
                <form-button
                  variant="primary"
                  name="Validar"
                  class="btn-validate"
                  :disabled="!file.password"
                  @click="validateCertificate(file, file.password, idx)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="form-buttons">
          <form-button
            type="submit"
            variant="success"
            name="Adicionar todos"
            :disabled="invalid"
          />
          <form-button
            variant="secondary"
            name="Remover arquivos"
            :disabled="!certificateFiles.length"
            @click="removeCertificates"
          />
        </div>
      </form>
    </validation-observer>
  </section>
</template>

<script>
const ACTIONS = {
  USER_CERTIFICATES: 'user',
  INSERT_CERTIFICATES: 'insert',
  VALIDATE_CERTIFICATE: 'validate'
}

const AXIOS_HEADERS = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}

export default {
  components: {
    FormInput: () => import('@/components/Forms/FormInput.vue'),
    FormButton: () => import('@/components/Forms/FormButton.vue'),
    FormFile: () => import('@/components/Forms/FormFile.vue'),
    Certificate: () => import('@/components/Certificate.vue')
  },
  data() {
    return {
      certificates: [],
      certificateFiles: [],
      validated: {}
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUserData || null
    },

    isUserAdmin() {
      return this.user.email === this.$root.admin
    }
  },
  watch: {
    certificateFiles(newValue) {
      this.validated = {}
      newValue.forEach((value, idx) => (this.validated[idx] = false))
    }
  },
  mounted() {
    this.waitForUser()
  },
  methods: {
    waitForUser() {
      if (!this.user._id) {
        return setTimeout(this.waitForUser, 100)
      }

      this.getUserCertificates()
    },

    getUrl(action = '') {
      return `${this.$root.serverURL}/certificates/${action}`
    },

    async getUserCertificates() {
      try {
        const url = this.isUserAdmin
          ? this.getUrl()
          : this.getUrl(ACTIONS.USER_CERTIFICATES) + `/${this.user._id}`

        const { data } = await this.$axios.get(url)
        this.certificates = this.orderCertificatesByExpiration(
          data.certificates
        )
      } catch (error) {
        this.$root.showErrorMessage(error.message)
      }
    },

    orderCertificatesByExpiration(certificates) {
      return certificates.sort((prior, next) => {
        if (prior.expiration > next.expiration) return 1
        if (prior.expiration < next.expiration) return -1
        return 0
      })
    },

    async addCertificates() {
      try {
        const url = this.getUrl(ACTIONS.INSERT_CERTIFICATES)
        const post = this.handleFiles()

        const { data } = await this.$axios.post(url, post, AXIOS_HEADERS)

        this.getUserCertificates()
        this.removeCertificates()
        this.$root.showSuccessMessage(data.message)
      } catch (error) {
        this.$root.showErrorMessage(error.response.data.message)
      }
    },

    handleFiles() {
      const formData = new FormData()
      const passwords = []

      formData.append('userId', this.user._id)
      this.certificateFiles.forEach((file, index) => {
        formData.append(`certificate${index}`, file)
        passwords.push(file.password)
      })

      formData.append(`passwords`, passwords) // ${index}

      return formData
    },

    removeCertificates() {
      this.certificateFiles = []
    },

    async validateCertificate(certificate, password, index) {
      try {
        const url = this.getUrl(ACTIONS.VALIDATE_CERTIFICATE)
        const post = new FormData()
        post.append('certificate', certificate)
        post.append('password', password)

        const { data } = await this.$axios.post(url, post, AXIOS_HEADERS)
        console.log(data)

        this.validated[index] = data.valid
        this.validated = { ...this.validated }
      } catch (error) {
        this.validated[index] = error.response.data.valid
        this.validated = { ...this.validated }
        this.$root.showErrorMessage(error.response.data.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.files-certificate {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 15px;

  .card-certificate-file {
    flex-direction: row;
    align-items: center;
    padding: 0.5rem 1rem;
    gap: 1rem;

    .icon {
      width: calc(70px + 0.5rem);
      border-radius: 50%;
      display: grid;
      place-items: center;

      svg {
        width: 2em;
        height: 2em;
        color: var(--gray);
      }
    }

    .card-content {
      width: 100%;

      .certificate-name {
        margin: 0;
      }

      .input-certificate {
        gap: 1rem;

        .input-certificate-password {
          width: 100%;
        }

        .btn-validate {
          height: fit-content;
        }
      }
    }
  }

  .card-certificate-file.invalid {
    border-color: var(--danger);

    .icon svg {
      color: var(--danger);
    }
  }

  .card-certificate-file.valid {
    border-color: var(--success);

    .icon svg {
      color: var(--success);
    }
  }
}

.form-buttons {
  button.btn:first-of-type {
    margin-right: 6px;
  }

  button.btn:last-of-type {
    margin-left: 6px;
  }
}
</style>
