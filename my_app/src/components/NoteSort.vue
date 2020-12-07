<template>
    <div @click="">
          昇順
    </div>
    <div @click="">
          降順
    </div>
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
