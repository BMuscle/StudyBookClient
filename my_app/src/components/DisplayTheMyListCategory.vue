<template>
  <div>
    <input
      :value="MyList.category.name"
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
import MyList from '../models/MyList'

export default {
  computed: {
    ...mapState('mylists', ['focusMyList']),
    categories() {
      return Category.all()
    },
    mylist() {
      return MyList.query()
        .with('category')
        .find(this.focusMyList)
    }
  },
  methods: {
    setCategory(name) {
      this.mylist.category_id = Category.getCategory(name).online_id
      this.mylist.$save()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
