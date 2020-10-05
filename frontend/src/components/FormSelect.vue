<template>
  <div :class="'input-group input-group-sm col-' + colSize">
    <label :for="inputId">{{ labelText }}</label>
    <select
      :class="`form-control ${validated ? 'validated' : 'not-validated'}`"
      :id="inputId"
      :disabled="disabled"
      v-model="value"
    >
      <option
        v-for="option in options"
        :key="option.key"
        :value="option.value"
        :disabled="option.disabled"
        >{{ option.name }}</option
      >
    </select>
    <span class="input-validation-message" v-show="!validated">{{
      validationMessage
    }}</span>
  </div>
</template>

<script>
module.exports = {
  props: {
    colSize: {
      type: String,
      required: true
    },
    labelText: {
      type: String,
      default: ''
    },
    inputId: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    validation: {
      type: [String, Function],
      default: null
    },
    requireValidation: {
      type: Boolean,
      default: false
    },
    validationMessage: {
      type: String,
      default: 'Selecione uma opção'
    },
    validated: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value() {
      this.validate()
      this.$emit('change', this.value)
    }
  },
  methods: {
    validate() {
      if (this.requireValidation && !this.value) this.validated = false
      else this.validated = true
      this.$emit('validation', this.validated)
    }
  }
}
</script>

<style scoped>
div {
  margin-bottom: 25px;
}

label {
  width: 100%;
  font-size: 16px;
  letter-spacing: 1px;
}

select.form-control {
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0px 1px 2px 0px #88888888;
  height: 40px;
}
select.form-control:focus {
  transform: translateY(-1px);
  box-shadow: 0px 2px 4px 1px #88888888;
}

select.form-control:disabled {
  background-color: #eeeeee !important;
}
select.form-control.not-validated {
  border-color: #dc3545;
}
span.input-validation-message {
  color: #dc3545;
  font-size: 12px;
  position: absolute;
}
</style>
