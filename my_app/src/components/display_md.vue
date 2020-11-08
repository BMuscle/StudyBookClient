<template>
  <span v-html="mdHtml"></span>
</template>

<script>
import marked from 'marked'

export default {
  props: {
    mdData: {
      type: String,
      require: true,
      default: ''
    }
  },
  computed: {
    mdHtml: function() {
      return marked(this.mdData)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
