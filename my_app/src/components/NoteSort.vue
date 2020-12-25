<template>
  <div>
    <select class=" select form-control" id="sort" name="sortSelect" @change="Select">
      <option value="inode,asc" selected>タイトルの昇順</option>
      <option value="inode,desc">タイトルの降順</option>
      <option value="updated_at,asc">更新時間の昇順</option>
      <option value="updated_at,desc">更新時間の降順</option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Sort: 'inode,asc'
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

<style scoped lang="sass">
.select
  font-size: 0.73em
  line-height: 1.2
  padding: 2px 10px
  height: 24px
</style>
