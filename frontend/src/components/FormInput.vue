<template>
  <div :class="'col-' + colSize">
    <label :for="inputId">{{ labelText }}</label>
    <input
      :class="`form-control ${validated ? 'validated' : 'not-validated'}`"
      :type="inputType"
      :id="inputId"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
    <span class="validation-message" v-show="!validated">{{
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
    inputType: {
      type: String,
      required: true
    },
    inputId: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
    },
    validator: {
      type: Function,
      default: null
    },
    requireValidation: {
      type: Boolean,
      default: false
    },
    validationMessage: {
      type: String,
      default: 'Este campo não pode estar vazio'
    },
    validated: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value() {
      this.validate()
    },
  },
  methods: {
    validate() {
      if (!this.validator) {
        if (this.requireValidation && !this.value) this.setValidatedFalse()
        else this.setValidatedTrue()
      } else {
        if (typeof this.validator === 'object') {
          if (this.validator[0](this.value, this.validator[1])) {
            this.setValidatedTrue()
          } else {
            this.setValidatedFalse()
          }
        } else if (this.validator(this.value)) {
          this.setValidatedTrue()
        } else {
          this.setValidatedFalse()
        }
      }
    },
    setValidatedTrue() {
      const validated = true
      this.$emit('validation', validated)
    },
    setValidatedFalse() {
      const validated = false
      this.$emit('validation', validated)
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

input.form-control {
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0px 1px 2px 0px #88888888;
  height: 40px;
}
input.form-control:focus {
  transform: translateY(-1px);
  box-shadow: 0px 2px 4px 1px #88888888;
}

input.form-control:disabled {
  background-color: #eeeeee !important;
}
input.form-control.not-validated {
  border-color: #dc3545;
}
span.validation-message {
  color: #dc3545;
  font-size: 12px;
  position: absolute;
}
</style>
