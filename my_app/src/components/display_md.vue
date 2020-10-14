<template>
  <span v-html="md_html"></span>
</template>

<script>
export default {
  props: {
    md_data: String
  },
  computed: {
    md_html: function(){
      const marked = require('marked')
      return marked(this.md_data)
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
