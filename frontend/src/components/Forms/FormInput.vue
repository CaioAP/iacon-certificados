<template>
  <validation-provider
    v-slot="{ errors }"
    class="form-input"
    :name="label"
    tag="div"
    :rules="rulesAdapter"
  >
    <form-label
      :label="label"
      :required="required"
      :class="{ 'has-error': hasErrors(errors) }"
    />

    <b-form-input
      v-model="innerValue"
      v-bind="$attrs"
      v-on="$listeners"
      :state="state !== null ? state : !hasErrors(errors)"
      :class="{ 'has-error': hasErrors(errors) }"
    ></b-form-input>
    <form-error :errors="errors" />
  </validation-provider>
</template>

<script>
import FormElementMixin from '@/mixins/FormElement.js'

export default {
  components: {
    FormLabel: () => import('@/components/Forms/FormLabel.vue'),
    FormError: () => import('@/components/Forms/FormError')
  },
  mixins: [FormElementMixin],
  props: {
    value: {
      type: String,
      default: ''
    },
    state: {
      type: Boolean,
      default: null
    }
  },
  computed: {
    rulesAdapter() {
      return { ...this.rules, required: this.required }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-input {
  margin-bottom: 15px;
}
</style>
