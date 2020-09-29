<template>
  <Section title="Documentos">
    <Form>
      <Datatable :columns="[]" />
    </Form>
  </Section>
</template>

<script>
import Section from '@/components/Section.vue'
import Form from '@/components/Form.vue'
import Datatable from '@/components/Datatable.vue'

export default {
  props: {
    userhash: String
  },
  components: {
    Section,
    Form,
    Datatable
  }
}
</script>

<style lang="scss" scoped></style>
