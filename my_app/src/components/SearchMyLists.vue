<template>
  <div class="search">
    <input v-model="query" class="search-form" type="text" placeholder="検索" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  data: function() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapState('my_lists', {
      searchParams: state => state.searchParams
    })
  },
  methods: {
    ...mapMutations('my_lists', ['setSearchParams']),
  },
  watch: {
    query: function(query) {
      this.setSearchParams(query)
    }
  },
  created() {
    this.setSearchParams('')
  }
}
</script>

<style scoped lang="scss">
.search {
  width: 100%;
  padding: 5px 0;
  .search-form {
    display: block;
    padding: 3px 5px;
    border-radius: 5px;
    width: 100%;
    border: none;
    &:focus {
      outline: 0;
      border: none;
    }
  }
}
</style>
