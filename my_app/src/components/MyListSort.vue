<template>
  <select class="sort form-control" id="sort" name="sortSelect" @change="Select">
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

<style scoped lang="sass">
.sort
  font-size: 0.73em
  line-height: 1.2
  padding: 2px 10px
  height: 24px
  margin-top: 3px
</style>
