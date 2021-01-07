<template>
  <div>
    <button @click="Create()" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Note from '@/models/Note'
import { createNote } from './NoteCRUD.js'
import { setFocusNote } from '../store/notes.js'
import { OpenEditor } from './filterdNotes.vue'
export default {
  components: {},
  data: function() {
    return {
      selectedDir: '',
      inode1: ''
    }
  },
  computed: {
    notes() {
      return Note.query()
        .whereIdIn(this.filteredNotes)
        .with('category')
        .with('tags')
        .get()
    }
  },
  methods: {
    ...mapMutations('notes', ['setFocusNote']),
    Create() {
      this.selectedDir = this.notes.parent_directory_path
      createNote(this.selectedDir, '新しいノート')
      this.inode1 = createNote(this.selectedDir, '新しいノート').inode
      console.log(this.selectedDir)
      setFocusNote(this.inode)
    }
  }
}
</script>

<style></style>
