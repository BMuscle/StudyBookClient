<template>
  <div>
    <div v-for="(directory, index) in bookmarks" :key="directory.inode">
      <div @click="selectDirectory(index)">
        {{ directory.directory_name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Directory from '../models/Directory'

export default {
  computed: {
    ...mapState('bookmark', ['directories']),
    bookmarks() {
      return Directory.query()
        .whereIdIn(this.directories)
        .with('notes')
        .get()
    },
    bookmarksName() {
      return this.bookmarks.map(record => record.directory_name)
    }
  },
  methods: {
    ...mapMutations('bookmark', ['setDirectories']),
    ...mapMutations('notes', ['setDescendantNotes']),
    selectDirectory(index) {
      const bookmarkNotes = this.descendantNotes(this.bookmarks[index].inode)
      const bookmarkInodes = bookmarkNotes.map(note => note.inode)
      this.setDescendantNotes(bookmarkInodes)
    },
    descendantNotes(directoryInode) {
      const directory = Directory.query()
        .with('notes')
        .with('child_directories')
        .find(directoryInode)
      let addNotes = []
      for (const childDirectory of directory.child_directories) {
        addNotes = addNotes.concat(this.test(childDirectory.inode))
      }
      return directory.notes.concat(addNotes)
    }
  }
}
</script>

<style></style>
