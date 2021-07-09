<template>
  <div v-if="label" class="form-label">
    <label>{{ label }}</label>
    <span v-if="required" class="required">*</span>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean
    }
  }
}
</script>

<style scoped>
.required {
  color: red;
}

.form-label {
  width: 100%;
  margin-bottom: 5px;
}
</style>
