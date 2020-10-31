<template>
  <div class="hello">
    <p>コンポーネント HelloWorld（部品）</p>
    <p>データの表示 {<b>{{ msg }}</b>}</p>
    <p>親から子へのデータ渡し {<b>{{ text_data }}</b>}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    text_data: String
  },
  data: function () {
    return {
      msg: 'メッセージ'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
