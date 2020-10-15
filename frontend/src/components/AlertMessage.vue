<template>
  <div class="alert-message">
    <b-alert 
      :show="show" 
      :variant="variant"
      :dismissible="dismissible"
    > {{message}} </b-alert>
  </div>
</template>

<script>
  export default {
    props: {
      variant: {
        type: String,
        default: 'primary'
      },
      message: {
        type: String,
        default: 'Success!'
      },
      show: {
        type: Boolean,
        default: false
      },
      dismissible: {
        type: Boolean,
        default: true
      },
    },
  }
</script>

<style lang="scss" scoped>
div.alert-message {
  margin: auto 1rem;
}
</style>