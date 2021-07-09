export default {
  data: () => ({
    innerValue: null
  }),
  watch: {
    value(val) {
      this.innerValue = val
    },
    innerValue(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    this.innerValue = this.value
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    rules: {
      type: Object,
      default: () => {}
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasErrors(errors) {
      return errors.length > 0
    }
  }
}
