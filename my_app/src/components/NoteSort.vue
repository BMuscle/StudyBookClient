<template>
  <select id="sort" name="sortSelect" @change="Select">
    <option value="asc" value2="inode" selected>タイトルの昇順</option>
    <option value="desc" value2="inode">タイトルの降順</option>
    <option value="asc" value2="inode" selected>更新時間の昇順</option>
    <option value="desc" value2="inode">更新時間の降順</option>
  </select>
</template>

<script>
export default {
  name: 'NoteSort',
  data() {
    return {
      Selected: 'inode',
      Sort: 'desc'
    }
  },
  methods: {
    Select(event) {
      this.Sort = event.target.value
      this.Selected = event.target.value2
      console.log(event.target.value)
      console.log(event.target.value2)
      this.$emit('filterd-notes', this.Sort, this.Selected)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
