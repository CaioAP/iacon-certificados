<template>
  <div class="col-12">
    <div class="row d-flex justify-content-end">
      <div class="col-3 input-group input-group-sm mb-3">
        <input
          type="text"
          id="table-filter"
          class="form-control mb-1"
          v-model="table.filter"
          placeholder="Pesquisar"
        />
      </div>
      <div class="col-12 table-responsive">
        <datatable
          :columns="table.columns"
          :data="table.data"
          :filter="table.filter"
          :per-page="10"
        >
          <template slot="footer" slot-scope="{ rows, columns, pagination }">
            <tr>
              <td :colspan="columns.length">
                Mostrando linhas {{ pagination.from }} a
                {{ pagination.to - 1 }} de {{ pagination.of }} itens.
              </td>
            </tr>
          </template>
        </datatable>
        <datatable-pager v-model="page" type="abbreviated"></datatable-pager>
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
    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    const rows = []
    for (let i = 0; i < 1000; i++) {
      rows.push({
        id: i,
        user: {
          username: 'dprice' + i,
          firstName: 'Daniel',
          lastName: 'Price',
          email: 'dprice0@blogs.com'
        },
        address: '3 Toban Park',
        city: 'Pocatello',
        state: 'Idaho'
      })
    }
    return {
      table: {
        filter: '',
        columns: [
          { label: 'id', field: 'id' },
          {
            label: 'Username',
            field: 'user.username',
            headerClass: 'class-in-header second-class'
          },
          { label: 'First Name', field: 'user.firstName' },
          { label: 'Last Name', field: 'user.lastName' },
          { label: 'Email', field: 'user.email' },
          {
            label: 'Address',
            representedAs: ({ address, city, state }) =>
              `${address} ${city}, ${state}`,
            interpolate: true
          }
        ],
        data: rows
      }
    }
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
  }
  tfoot tr td {
    position: absolute;
    left: 10px;
    border: none;
  }
}

nav {
  display: flex !important;
  float: right;

  ul.pagination {
    box-shadow: 0px 1px 2px 0px #888888;

    li {
      color: #111;
      padding: 2px 10px;
      background-color: #00000011;
    }
    li:hover {
      transform: translateY(-1px);
      box-shadow: 0px 2px 4px 1px #88888888;
    }
    li:first-of-type {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    li:last-of-type {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    li.active {
      color: #fff;
      background-color: #276485; //#2c5ec9;
    }
    li.disabled:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
