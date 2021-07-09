<template>
  <ul v-if="hasErrors(errors)" class="form-error has-error">
    <li v-for="(e, index) in errors" :key="index">
      <span>{{ e }}</span>
    </li>
  </ul>
</template>

<script>
import FormElementMixin from '@/mixins/FormElement.js'

export default {
  mixins: [FormElementMixin],

  props: {
    errors: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.form-error {
  padding: 0;
  margin: 5px 0;
}

.form-error li {
  list-style: none;
}

.form-error li span {
  font-size: 0.9rem;
  color: var(--danger);
}
</style>
