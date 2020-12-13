<template>
  <select id="sort" name="sortSelect" @change="Select">
    <option value="inode,asc" selected>タイトルの昇順</option>
    <option value="inode,desc">タイトルの降順</option>
    <option value="updated_at,asc">更新時間の昇順</option>
    <option value="updated_at,desc">更新時間の降順</option>
  </select>
</template>

<script>
export default {
  data() {
    return {
      Sort: 'asc,inode'
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
