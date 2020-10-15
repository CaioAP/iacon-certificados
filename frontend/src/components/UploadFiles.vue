<template>
  <div id="upload-component">
    <input
      type="file"
      :ref="inputId"
      multiple
      @change="filesChanged"
      v-show="false"
    />
    <div class="file-selection">
      <a class="input-file-info" @click="clickInputFile">
        Clique aqui para adicionar arquivos
      </a>
      <div class="file-item" v-for="file in files" :key="file.id">
        <p class="file-item-name">{{ file.file.name }}</p>
        <button
          type="button"
          class="btn btn-default btn-close"
          @click="closeFile(file.id)"
        >
          <font-awesome-icon :icon="closeIcon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { faTimes } from '@fortawesome/free-solid-svg-icons'
export default {
  data() {
    return {
      files: []
    }
  },
  computed: {
    inputId() {
      return 'input-file'
    },
    closeIcon() {
      return faTimes
    }
  },
  methods: {
    clickInputFile(event) {
      event.preventDefault()
      this.$refs[this.inputId].click()
    },
    filesChanged(event) {
      let startId = this.files.length
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i]
        const fileNameParts = file.name.split('.')
        this.files.push({
          id: startId,
          ext: fileNameParts[fileNameParts.length - 1],
          file: file
        })
        startId++
      }

      this.$emit('files', this.files)
    },
    closeFile(id) {
      const fileIdx = this.files.findIndex(file => file.id === id)
      this.files.splice(fileIdx, 1)

      this.$emit('files', this.files)
    }
  }
}
</script>

<style lang="scss" scoped>
div.file-selection {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 4px 8px;

  div.file-item {
    display: flex;
    max-height: 40px;
    padding: 4px 8px;
    margin: 3px 0px;
    width: 100%;
    background-color: #28a745aa;
    border: 1px solid #28a745;
    border-radius: 10px;
    box-shadow: 0px 1px 2px 0px #00000088;

    p.file-item-name {
      width: 100%;
      margin: 0px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    button.btn-close {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0px;

      svg {
        width: 20px;
        height: 20px;

        path {
          fill: #444;
        }
      }
    }
    button.btn-close:hover {
      border-radius: 5px;
      background-color: #dc3545;

      svg {
        path {
          fill: #fff;
        }
      }
    }
  }

  a.input-file-info {
    color: #444;
    width: 100%;
    text-align: center;
    margin: 8px;
  }
  a.input-file-info:hover {
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: #444;
  }
}
</style>
