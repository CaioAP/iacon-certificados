<template>
  <section>
    <header>
      <h4 class="display-4 section-header text-uppercase text-center">
        {{ title }}
      </h4>
    </header>
    <article>
      <div class="row">
        <slot></slot>
      </div>
    </article>
  </section>
</template>

<script>
module.exports = {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  border: 1px solid #88888888;
  // border-top-left-radius: 5px;
  // border-top-right-radius: 5px;
  border-radius: 5px;
  padding-top: 1px;
  padding-left: 1px;
  padding-right: 1px;
  margin-bottom: 4px;

  h4.section-header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: #ccc;
    padding: 4px 8px;
    margin: 0px;
    font-size: 18px;
    letter-spacing: 1px;
  }

  article {
    background-color: #e8e8e8;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    .row {
      width: 100%;
      margin: 0px;
    }
  }
}

section:last-of-type {
  margin-bottom: 30px;
}
</style>
