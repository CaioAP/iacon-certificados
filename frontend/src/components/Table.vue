<template>
  <table :id="tableId">
    <thead>
      <tr>
        <th 
          v-for="(header, idx) in headers" 
          :key="idx" 
          :style="`${header.width ? 'width: ' + header.width : ''}`">
          {{header.title}}
        </th>
        <th class="th-last" v-if="buttonDelShow">Opções</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(content, idx) in contents" :key="'content-' + idx" :class="idx % 2 == 1 ? 'odd' : 'even'">
        <td v-for="(cont, i) in content" :key="'cont-' + i">{{cont}}</td>
        <td class="td-button" v-if="buttonDelShow">
          <button type="button" class="btn btn-del btn-table" @click="removeFromTable(idx)">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
      <tr class="tr-last" v-if="buttonAddShow">
        <td class="td-last td-button" :colspan="headers.length + 1">
          <button type="button" class="btn btn-add btn-table" data-toggle="modal" :data-target="`#${buttonModalId}`">
            <font-awesome-icon :icon="icons.faPlus" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {
  faPlus
} from '@fortawesome/free-solid-svg-icons'
export default {
  props: {
    tableId: {
      type: String,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    contents: {
      type: Array,
      required: true
    },
    buttonModalId: {
      type: String,
      required: true
    },
    buttonAddShow: {
      type: Boolean,
      default: true
    },
    buttonDelShow: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    icons() {
      return {
        faPlus
      }
    }
  },
  methods: {
    removeFromTable(idx) {
      this.$emit('remove', idx)
    }
  },
}
</script>

<style scoped>
  table {
    width: 100%
  }
  thead tr {
    border-bottom: 1px solid #88888888;
  }
  thead th.th-last {
    max-width: 5%
  }
  tbody tr.odd {
    background-color: #BBBBBB88;
  }
  tbody td {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  tbody td:hover {
    overflow: visible;
    white-space: break-spaces;
  }
  tbody td.even:hover {
    background-color: #E8E8E8;
  }
  tbody td.odd:hover {
    background-color: #D0D0D0;
  }
  tbody tr td {
    padding: 2px;
  }
  tbody tr.tr-last {
    width: 100%;
  }
  tbody td.td-button {
    text-align: center;
  }
  tbody td.td-last {
    padding: 4px;
    text-align: center;
  }
  button.btn {
    margin: 8px;
    box-shadow: 0px 2px 1px 1px #88888888;
    font-size: 18px;
  }
  button.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0px 4px 4px 1px #88888888;
  }
  button.btn-table {
    padding: 0px;
    margin: 0px;
  }
  button.btn-add {
    width: 40px;
    height: 40px;
    font-size: 22px;
    background-color: #478F24;
    border-color: #478F24;
  }
  button.btn-del {
    width: 30px;
    height: 30px;
    font-size: 18px;
    background-color: #AE333F;
    border-color: #AE333F;
  }
  i {
    color: #FFFFFF;
  }
</style>