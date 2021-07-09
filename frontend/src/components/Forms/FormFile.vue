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
    <b-form-file
      v-model="innerValue"
      :state="state"
      v-bind="$attrs"
      v-on="$listeners"
      :placeholder="placeholder"
      :drop-placeholder="dropPlaceholder"
      :class="{ 'has-error': hasErrors(errors) }"
    ></b-form-file>
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
      type: [String, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Escolha um arquivo ou solte-o aqui...'
    },
    dropPlaceholder: {
      type: String,
      default: 'Solte o arquivo aqui...'
    }
  },
  computed: {
    rulesAdapter() {
      return { ...this.rules, required: this.required }
    },

    state() {
      return null
      // return (
      //   (this.innerValue instanceof Array && Boolean(this.innerValue.length)) ||
      //   (typeof this.innerValue === 'string' && Boolean(this.innerValue))
      // )
    }
  }
}
</script>

<style>
.custom-file-input ~ .custom-file-label[data-browse]::after {
  content: 'Buscar';
}

.custom-file-label[data-browse]:hover {
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.form-input {
  margin-bottom: 15px;
}
</style>
