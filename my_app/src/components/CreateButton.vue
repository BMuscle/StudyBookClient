<template>
  <div>
    <button @click="Create()">新規作成ボタン</button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Note from '../models/Note'
import Directory from '../models/Directory'
import { createNote } from './NoteCRUD.js'
import { setFocusNote } from '../store/notes.js'
import { OpenEditor } from './filterdNotes.vue'
export default {
  components: {},
  data: function() {
    return {
      selectedDir: '',
      note: ''
    }
  },
  computed: {
    ...mapState('notes', ['focusDirectory']),
    notes() {
      return Note.query()
        .whereIdIn(this.filteredNotes)
        .with('category')
        .with('tags')
        .get()
    },
    directories() {
      return Directory.query()
        .where('parent_inode', null)
        .with('child_directories')
        .get()
    }
  },
  methods: {
    ...mapMutations('notes', ['setFocusNote']),
    async Create() {
      this.selectedDir = Directory.find(this.focusDirectory)
      const path = this.selectedDir?.path_from_root ?? ''
      this.note = await createNote(path, '新しいノート.md')
      this.setFocusNote(this.note.inode)
    }
  }
}
</script>

<style></style>
