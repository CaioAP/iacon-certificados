<template>
  <div class="col-12 content-modal-form">
    <form class="form-filter" method="post">
      <div :class="`form-group form-group-modal row ${flex ? 'd-flex' : ''} justify-content-${fJustify} align-items-${fAlign}`">
        <slot></slot>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    flex: {
      type: Boolean,
      default: false
    },
    fJustify: {
      type: String,
      default: "start"
    },
    fAlign: {
      type: String,
      default: "center"
    }
  },
}
</script>

<style scoped>
div.content-modal-form {
  width: 100%;
}

form.form-filter {
  width: 100%;
}

div.form-group-modal {
  margin: 0px -15px;
}
</style>