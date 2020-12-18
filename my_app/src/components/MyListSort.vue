<template>
  <select id="sort" name="sortSelect" @change="Select">
    <option value="asc" selected>タイトルの昇順</option>
    <option value="desc">タイトルの降順</option>
  </select>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      Sort: 'asc'
    }
  },
  methods: {
    ...mapMutations('my_lists', ['setSort']),
    Select(event) {
      this.Sort = event.target.value
      this.setSort(this.Sort)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
