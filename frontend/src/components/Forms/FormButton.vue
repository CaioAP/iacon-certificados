<template>
  <b-button v-bind="$attrs" v-on="$listeners">
    {{ name }}
  </b-button>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
