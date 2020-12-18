<template>
  <select id="sort" name="sortSelect" @change="Select">
    <option value="index,asc" selected>タイトルの昇順</option>
    <option value="index,desc">タイトルの降順</option>
  </select>
</template>

<script>
export default {
  data() {
    return {
      Sort: 'index,asc'
    }
  },
  methods: {
    Select(event) {
      this.Sort = event.target.value
      this.$emit('sort-mylist', this.Sort)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
