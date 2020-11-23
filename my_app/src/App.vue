<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script>
import store from './store'
import Header from './views/Header'
import UpdatedAt from './models/UpdatedAt'

// 全体で共通のコンポーネント
export default {
  store,
  components: {
    Header
  },
  created: function() {
    if (
      !UpdatedAt.query()
        .where('label', 'my_lists')
        .exists()
    ) {
      UpdatedAt.insert({ data: { label: 'my_lists', updated_at: 0 } })
    }
    if (
      !UpdatedAt.query()
        .where('label', 'tags')
        .exists()
    ) {
      UpdatedAt.insert({ data: { label: 'tags', updated_at: 0 } })
    }
    if (
      !UpdatedAt.query()
        .where('label', 'categories')
        .exists()
    ) {
      UpdatedAt.insert({ data: { label: 'categories', updated_at: 0 } })
    }
    if (
      !UpdatedAt.query()
        .where('label', 'note_downloads')
        .exists()
    ) {
      UpdatedAt.insert({ data: { label: 'note_downloads', updated_at: 0 } })
    }
    if (
      !UpdatedAt.query()
        .where('label', 'note_uploads')
        .exists()
    ) {
      UpdatedAt.insert({ data: { label: 'note_uploads', updated_at: 0 } })
    }
  }
}
</script>

<style scoped lang="scss">
#app {
  width: 100%;
  height: 100vh;
}
</style>
