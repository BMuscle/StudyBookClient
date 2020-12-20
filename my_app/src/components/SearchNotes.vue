<template>
  <div class="search">
    <input v-model="query" class="search-form" type="text" placeholder="検索" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Note from '@/models/Note'
import { readNoteBody } from './NoteCRUD'

export default {
  data: function() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapState('notes', {
      descendantNotes: state => state.descendantNotes
    })
  },
  watch: {
    descendantNotes: function(descendantNotes) {
      this.filter(this.query, descendantNotes)
    },
    query: function(query) {
      this.filter(query, this.descendantNotes)
    },
  },
  methods: {
    ...mapMutations('notes', ['setFilteredNotes']),
    async filter(query, descendantNotes) {
      // idからノート全取得
      let rawNotes = Note.query()
        .whereIdIn(descendantNotes)
        .with('tags')
        .with('category')
        .get()
      let notes = []

      for (let rawNote of rawNotes) {
        // 本文読み込み & 正規化
        notes.push({
          inode: rawNote.inode,
          title_category_tags: `${rawNote.title} ${rawNote.category.name} ${rawNote.tags
            .map(tag => tag.name)
            .join(' ')}`,
          body: readNoteBody(rawNote.parent_directory_path_from_root, rawNote.file_name)
        })
      }
      let resultIds = []
      let splitQuery = query.split(' ')
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
  padding: 5px 3px;
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
