<template>
  <div>
    <select class="select form-control" ref="select" @change="setCategory($event.target.selectedIndex)">
      <option v-for="category in categories" :key="category.online_id">
        {{ category.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Category from '../models/Category'

export default {
  computed: {
    ...mapState('notes', ['filteringCategoryId']),
    categories() {
      return [{ name: '指定なし' }].concat(Category.all())
    }
  },
  mounted() {
    this.$refs.select.selectedIndex =
      this.filteringCategoryId == null
        ? 0
        : this.categories.findIndex(category => category.online_id == this.filteringCategoryId)
  },
  methods: {
    ...mapMutations('notes', ['setfilteringCategoryId']),
    setCategory(index) {
      const category_id = this.categories[index].online_id ?? null
      this.setfilteringCategoryId(category_id)
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
