<template>
  <div class="search">
    <input v-model="query" class="search-form" type="text" placeholder="検索" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Note from '../models/Note'
import { readNoteBody } from './NoteCRUD'

export default {
  data: function() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapState('notes', {
      filteringCategoryId: state => state.filteringCategoryId,
      descendantNotes: state => state.descendantNotes
    }),
    rawNotes() {
      const noteQuery =
        this.filteringCategoryId != null
          ? Note.query().where('category_id', this.filteringCategoryId)
          : Note.query()
      return noteQuery
        .whereIdIn(this.descendantNotes)
        .with('tags')
        .with('category')
        .get()
    }
  },
  watch: {
    query() {
      this.filter()
    },
    rawNotes() {
      this.filter()
    }
  },
  methods: {
    ...mapMutations('notes', ['setFilteredNotes']),
    async filter() {
      const notes = []
      for (let rawNote of this.rawNotes) {
        // 本文読み込み & 正規化
        notes.push({
          inode: rawNote.inode,
          title_category_tags: `${rawNote.title} ${
            rawNote.category ? rawNote.category.name : ''
          } ${rawNote.tags.map(tag => tag.name).join(' ')}`,
          body: readNoteBody(rawNote.parent_directory_path_from_root, rawNote.file_name)
        })
      }
      let resultIds = []
      let splitQuery = this.query.split(' ')
      // queryを分割する
      for (let note of notes) {
        if (
          this.queryInclude(splitQuery, note.title_category_tags) ||
          this.queryInclude(splitQuery, await note.body)
        ) {
          resultIds.push(note.inode)
        }
      }
      // idをセットする
      this.setFilteredNotes(resultIds)
    },
    queryInclude(splitQuery, str) {
      for (let q of splitQuery) {
        if (str.indexOf(q) == -1) {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  width: 100%;
  .search-form {
    display: block;
    padding: 1px 5px;
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
