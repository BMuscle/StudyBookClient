<template>
  <select id="sort" name="sortSelect" @change="Select()">
    <option value="asc" selected>昇順</option>
    <option value="desc">降順</option>
  </select>
</template>

<script>
export default {
  name: 'NoteSort',
  data() {
    return {
      sort: 'asc'
    }
  },
  methods: {
    Select() {
      this.$emit('filterdNotes', this.uSort)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
