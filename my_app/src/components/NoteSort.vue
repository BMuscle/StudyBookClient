<template>
  <select id="sortSelect" name="sortSelect">
    <option value="1" selected>昇順</option>
    <option value="2">降順</option>
  </select>
  <div>
    aaaa
  </div>
</template>

<script>
export default {
  created: function(){
    console.log("hoge")
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
