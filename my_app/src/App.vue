<template>
  <div id="app">
    <Header />
    <router-view />
    <FlashMessage />
    <!-- <AllData /> -->
  </div>
</template>

<script>
import store from './store'
import * as watcher from './components/watcher'
import Header from './views/Header'
import FlashMessage from './components/FlashMessage'
import AllData from './components/AllData'
import UpdatedAt from './models/UpdatedAt'
import Category from './models/Category'
import { mapState } from 'vuex'

// 全体で共通のコンポーネント
export default {
  store,
  components: {
    Header,
    FlashMessage,
    AllData
  },
  computed: {
    ...mapState('category_module', ['default_id'])
  },
  created() {
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
    if (!Category.find(this.default_id)) {
      // デフォルトカテゴリー生成（仮）
      Category.insert({
        data: {
          online_id: this.default_id,
          name: '未分類'
        }
      })
    }

    watcher.onAppReady()
  }
}
</script>

<style scoped lang="scss">
#app {
  width: 100%;
  height: 100vh;
  font-family: "Hiragino Sans", sans-serif;
}
</style>

<style lang="sass">
@keyframes fadeIn
  from
    opacity: 0
  to
    opacity: 1

@keyframes fadeOut
  from
    opacity: 1
  to
    opacity: 0

</style>
