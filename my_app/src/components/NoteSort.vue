<template>
<select id="sortSelect" name="sortSelect">
  <option value="1" selected @click="isSelect = 1">昇順</option>
  <option value="2" @click="isSelect = 2">降順</option>
</select>
</template>

<script>
export default {
  name: 'NoteSort',
  props: {
    isSelect: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
