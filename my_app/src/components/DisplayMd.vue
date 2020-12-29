<template>
  <div class="body" v-html="mdHtml" />
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'

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
      marked.setOptions({
        langPrefix: 'hljs language-',
        highlight: function(code, lang) {
          return hljs.highlightAuto(code, [lang]).value
        }
      })
      return marked(this.mdData)
    }
  }
}
</script>

<style lang="scss">
@import '~highlight.js/scss/railscasts';
.body {
  font-size: 0.8em;
  min-width: 400px;

  .hljs {
    border-radius: 10px;
    padding: 15px 30px;
  }

  h1 {
    font-size: 2.3em
  }
  h2 {
    font-size: 1.8em
  }
  h3 {
    font-size: 1.5em
  }

  h1,
  h2 {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
}
</style>
