<template>
  <select v-model="nowCategory.name" @change="emitChange($event.target.selectedIndex)">
    <option v-for="category in categories" :key="category.online_id">
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
