<template>
  <div class="col-12 form">
    <form method="post">
      <div
        :class="
          `form-group row justify-content-${justify} align-items-${align}`
        "
      >
        <slot></slot>
      </div>
    </form>
  </div>
</template>

<script>
module.exports = {
  props: {
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'center'
    }
  }
}
</script>

<style lang="scss" scoped>
div.form {
  width: 100%;
  padding: 0px;

  form {
    width: 100%;

    .form-group {
      margin: 16px;
    }
  }
}
</style>
