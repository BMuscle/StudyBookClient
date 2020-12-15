<template>
  <div>
    <input
      :value="category"
      autocomplete="on"
      list="categories"
      @input="set_category($event.target.value)"
    />
    <datalist id="categories">
      <option v-for="n in categories" :key="n">{{ n }}</option>
    </datalist>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      categories: ['ハンバーガー', 'てりやきバーガー', 'ポテト']
    }
  },
  computed: mapState(['category']),
  methods: mapMutations(['set_category'])
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
