<template>
  <div>
    <input
      :value="note.category.name"
      autocomplete="on"
      list="categories"
      @change="setCategory($event.target.value)"
    />
    <datalist id="categories">
      <option v-for="category in categories" :key="category.online_id">
        {{ category.name }}
      </option>
    </datalist>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Category from '../models/Category'
import Note from '../models/Note'

export default {
  computed: {
    ...mapState('notes', ['focusNote']),
    categories() {
      return Category.all()
    },
    note() {
      return Note.query()
        .with('category')
        .find(this.focusNote)
    }
  },
  methods: {
    setCategory(name) {
      this.note.category_id = Category.getCategory(name).online_id
      this.note.$save()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
