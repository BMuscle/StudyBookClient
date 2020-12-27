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
        // code要素にdefaultで付くlangage-を削除
        // langPrefix: '',
        langPrefix: 'hljs language-',
        // highlightjsを使用したハイライト処理を追加
        highlight: function(code, lang) {
          return hljs.highlightAuto(code, [lang]).value
        }
      })
      return marked(this.mdData)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '~highlight.js/scss/railscasts';
.body {
  .hljs {
    border-radius: 10px;
    padding: 15px 30px;
  }

  h1,
  h2 {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
}
</style>
