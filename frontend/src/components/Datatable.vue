<template>
  <div class="col-12">
    <div class="row d-flex justify-content-between">
      <div class="col-1 input-group input-group-sm mb-1" v-if="showPerPage">
        <select class="form-control" v-model="perPage">
          <option v-for="(option, idx) in perPageOptions" :key="idx">{{
            option
          }}</option>
        </select>
      </div>
      <div class="col-3 input-group input-group-sm mb-2" v-if="showFilter">
        <input
          type="text"
          id="table-filter"
          class="form-control"
          v-model="filter"
          placeholder="Pesquisar"
        />
      </div>
      <div class="col-12">
        <!-- Main table element -->
        <b-table
          show-empty
          small
          striped
          stacked="md"
          :items="data"
          :fields="columns"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
        >
          <template v-slot:cell(actions)="row" v-if="buttons.length > 0">
            <button
              type="button"
              :class="'btn btn-' + button.id"
              @click="button.action(row, $event.target)"
              v-for="button in buttons"
              :key="button.id"
            >
              <font-awesome-icon
                :icon="button.content"
                v-if="button.type === 'icon'"
              />
              <p v-else>{{ button.content }}</p>
            </button>
          </template>
        </b-table>
      </div>
      <div class="col-4 d-flex justify-content-start">
        <p class="table-items-count">Mostrando {{ data.length }} itens</p>
      </div>
      <div class="col-4 d-flex justify-content-end">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
          first-text="Primeiro"
          prev-text="Anterior"
          next-text="Próximo"
          last-text="Último"
        >
        </b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
    },
    perPage: {
      type: Number,
      default: 10
    },
    perPageOptions: {
      type: Array,
      default: () => [10, 25, 50, 75, 100]
    },
    filter: {
      type: String,
      default: ''
    },
    filterOn: {
      type: Array,
      default: () => []
    },
    sortBy: {
      type: String,
      default: ''
    },
    sortDesc: {
      type: Boolean,
      deafult: false
    },
    sortDirection: {
      type: String,
      default: 'asc'
    },
    showFilter: {
      type: Boolean,
      default: true
    },
    showPerPage: {
      type: Boolean,
      default: true
    },
    showItemsCount: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentPage: 1,
      totalRows: 0,
      totalRowsTimesTried: 0
    }
  },
  methods: {
    setTotalRows() {
      if (this.totalRowsTimesTried === 50) {
        this.totalRows = 0
        return
      }

      this.totalRowsTimesTried++
      if (this.data.length > 0) {
        this.totalRows = this.data.length
      } else {
        setTimeout(this.setTotalRows, 100)
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  },
  mounted() {
    this.setTotalRows()
  }
}
</script>

<style lang="scss">
.table {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 12px !important;
  background-color: #ffffff;
  box-shadow: 0px 1px 2px 0px #88888888;

  thead tr {
    th {
      padding: 8px 12px;
      border-bottom: none;
      background-color: #c0c0c0;
      text-align: left !important;

      span:last-of-type {
        float: right;
      }
    }

    th:first-of-type {
      border-top-left-radius: 5px !important;
    }
    th:last-of-type {
      border-top-right-radius: 5px !important;
    }
  }
  tbody {
    tr {
      td {
        border-top: none;
        padding: 4px 12px;
        text-align: left !important;
      }
    }

    tr:last-of-type {
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    tr:nth-of-type(odd) {
      background-color: transparent !important;
    }
    tr:nth-of-type(odd):hover {
      background-color: #0000001a !important;
    }
    tr:nth-of-type(even) {
      background-color: rgba(0, 0, 0, 0.1);
    }
    tr:nth-of-type(even):hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    button.btn {
      margin: 0px 2px;
      color: #fff;
      svg {
        width: 1.25em;
      }
    }
  }
  tfoot tr td {
    position: absolute;
    left: 10px;
    border: none;
  }
}

ul.pagination {
  box-shadow: 0px 1px 2px 0px #888888;
  max-height: 30px;

  li.page-item {
    color: #111;
    background-color: #00000011;

    button.page-link {
      color: #276485;
    }
  }
  li.page-item:hover {
    transform: translateY(-1px);
    box-shadow: 0px 2px 4px 1px #88888888;
  }
  li.page-item:first-of-type {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;

    .page-link {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
  }
  li.page-item:last-of-type {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;

    .page-link {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
  li.page-item.active {
    background-color: #276485; //#2c5ec9;

    button.page-link {
      color: #ffffff;
      border-color: #276485;
      background-color: #276485;
    }
  }
  li.page-item.disabled:hover {
    transform: none;
    box-shadow: none;
  }
}
</style>
