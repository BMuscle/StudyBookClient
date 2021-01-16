<template>
  <div v-if="!isLoading" id="app">
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
import { mapMutations, mapState } from 'vuex'
import { initNoteDirectory } from './components/NoteCRUD'
import Note from './models/Note'
import { remote } from 'electron'

// 全体で共通のコンポーネント
export default {
  store,
  components: {
    Header,
    FlashMessage,
    AllData
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapState('category_module', ['default_id']),
    ...mapState('root', ['rootPath'])
  },
  created() {
    if (!this.rootPath) {
      const rootPath = remote.dialog.showOpenDialogSync(null, {
        properties: ['openDirectory'],
        title: 'ノートを保存するフォルダを選択',
        buttonLabel: '選択'
      })?.[0]
      if (!rootPath) {
        remote.app.quit()
      }
      this.setRootPath(rootPath)
    }
    initNoteDirectory()

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
    const thisObj = this
    watcher.start(function() {
      thisObj.isLoading = false
    })
  },
  beforeUnmount() {
    watcher.stop()
  },
  methods: {
    ...mapMutations('root', ['setRootPath'])
  }
}
</script>

<style scoped lang="scss">
#app {
  width: 100%;
  height: 100vh;
  font-family: 'Hiragino Sans', sans-serif;
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
