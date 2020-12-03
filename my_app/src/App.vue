<template>
  <div id="app">
    <Header />
    <router-view />
    <AllData />
    <NoteView />
  </div>
</template>

<script>
import store from './store'
import * as watcher from './components/watcher'
import Header from './views/Header'
import UpdatedAt from './models/UpdatedAt'
import AllData from './components/AllData'
import NoteView from './components/Note.vue'

import Category from './models/Category'
import DeletedLocalNote from './models/DeletedLocalNote'
import Directory from './models/Directory'
import MyList from './models/MyList'
import Note from './models/Note'
import MyListNote from './models/MyListNote'
import MyListNoteTag from './models/MyListNoteTag'
import MyListNoteIndex from './models/MyListNoteIndex'
import NoteTag from './models/NoteTag'
import Tag from './models/Tag'

import CategoryData from './initialData/CategoryData'
import DeletedLocalNoteData from './initialData/DeletedLocalNoteData'
import DirectoryData from './initialData/DirectoryData'
import MyListData from './initialData/MyListData'
import MyListNoteData from './initialData/MyListNoteData'
import MyListNoteTagData from './initialData/MyListNoteTagData'
import MyListNoteIndexData from './initialData/MyListNoteIndexData'
import NoteData from './initialData/NoteData'
import NoteTagData from './initialData/NoteTagData'
import TagData from './initialData/TagData'

// 全体で共通のコンポーネント
export default {
  store,
  components: {
    Header,
    AllData,
    NoteView
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

    const categoryData = CategoryData
    Category.insert({ data: categoryData })
    const deletedLocalNoteData = DeletedLocalNoteData
    DeletedLocalNote.insert({ data: deletedLocalNoteData })
    //const directoryData = DirectoryData
    //Directory.insert({ data: directoryData })
    const my_listData = MyListData
    MyList.insert({ data: my_listData })
    const noteData = NoteData
    Note.insert({ data: noteData })
    MyListNoteIndex.insert({ data: MyListNoteIndexData })
    MyListNoteTag.insert({ data: MyListNoteTagData })
    MyListNote.insert({ data: MyListNoteData })
    const noteTagData = NoteTagData
    NoteTag.insert({ data: noteTagData })
    const tagData = TagData
    Tag.insert({ data: tagData })

    watcher.onAppReady()
  }
}
</script>

<style scoped lang="scss">
#app {
  width: 100%;
  height: 100vh;
}
</style>
