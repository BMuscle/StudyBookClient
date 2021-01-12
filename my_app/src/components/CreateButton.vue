<template>
  <div>
    <button @click="Create">新規作成ボタン</button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Note from '../models/Note'
import Directory from '../models/Directory'
import { Create } from './NoteMethods'
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
      const selectedDir = Directory.find(this.focusDirectory)
      const path = selectedDir?.path_from_root ?? ''
      Create(path)
    }
  }
}
</script>

<style></style>
