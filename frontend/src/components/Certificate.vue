<template>
  <div class="card card-certificate">
    <span class="icon">
      <fa icon="file-signature" />
    </span>
    <div class="card-content">
      <span class="inserted-at">{{ formatDate(insertedAt) }}</span>
      <p class="user-name">{{ userName }}</p>
      <p class="certificate-name">{{ certificateName }}</p>
      <span class="certificate-size"
        >Tamanho: {{ bytesToKilobytes(size) }}</span
      >
      <span class="certificate-size"
        >Validade: {{ formatDate(expiration) }}</span
      >
    </div>
  </div>
</template>

<script>
const KILOBYTES_SIZE = 1024
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      default: null
    },
    certificateName: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 0
    },
    insertedAt: {
      type: Date,
      required: true
    },
    expiration: {
      type: Date,
      required: true
    }
  },
  methods: {
    bytesToKilobytes(bytes) {
      return (bytes / KILOBYTES_SIZE).toFixed(2) + 'Kb'
    },

    formatDate(date) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      }

      return new Intl.DateTimeFormat('pt-BR', options).format(date)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-certificate {
  flex-direction: row;
  padding: 0.5rem 1rem;
  gap: 1rem;
  margin-bottom: 15px;

  .icon {
    width: calc(70px + 0.5rem);
    height: 70px;
    background-color: #eee;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;

    .inserted-at {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 14px;
      color: var(--gray);
    }

    .user-name {
      font-weight: bold;
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
</style>
