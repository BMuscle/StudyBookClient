<template>
  <select class="display-category" v-model="nowCategory.name" @change="emitChange($event.target.selectedIndex)">
    <option v-for="category in categories" :key="category.online_id" class="option">
      {{ category.name }}
    </option>
  </select>
</template>

<script>
import Category from '../models/Category'

export default {
  props: {
    noteCategory: Category
  },
  data() {
    return {
      nowCategory: this.noteCategory
    }
  },
  computed: {
    categories() {
      return Category.all()
    }
  },
  watch: {
    noteCategory(newCategory) {
      this.nowCategory = newCategory
    }
  },
  methods: {
    emitChange(index) {
      this.$emit('category-change', this.categories[index].name)
    }
  }
}
</script>

<style scoped lang="sass">
.display-category
  cursor: pointer
  padding: 1px 5px
  border-radius: 10px
  color: #6a6a6a
  background-color: #caffe6
  margin-right: 3px
  outline: none
  .option
    cursor: pointer
    background-color: #fff

</style>
