<template>
  <select id="sort" name="sortSelect" @change="Select">
    <option value="asc" selected>昇順</option>
    <option value="desc">降順</option>
  </select>
</template>

<script>
export default {
  name: 'NoteSort',
  data() {
    return {
      Sort: 'asc'
    }
  },
  methods: {
    Select(event) {
      this.Sort = event.target.value
      this.$emit('filterd-notes', this.Sort)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
