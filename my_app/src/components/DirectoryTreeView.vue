<template>
  <div class="main">
    <div class="directory-control">
      <div v-if="directories.length != 0" class="open-button" @click="isOpen = !isOpen">
        <img
          src="../images/folder_icon.png"
          width="13"
          height="13"
          class="directory-icon"
          :class="{ directory_close: !isOpen }"
        />
      </div>
    </div>
    <div class="directory-name" @click="setFocusDirectory(null)" :class="focusDirectory == null ? 'directory-active' : ''">
      ノート
    </div>
    <DirectoryTreeList v-if="directories.length != 0" v-show="isOpen" :directories="directories" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import DirectoryTreeList from './DirectoryTreeList.vue'
import Directory from '../models/Directory'
import Note from '../models/Note'

export default {
  components: {
    DirectoryTreeList
  },
  data: function() {
    return {
      isOpen: true
    }
  },
  computed: {
    ...mapState('notes', ['focusDirectory']),
    descendantNotes() {
      const notes = Directory.find(this.focusDirectory)?.descendantNotes ?? Note.queryExists().get()
      return notes.map(note => note.inode)
    },
    directories() {
      return Directory.query()
        .where('parent_inode', null)
        .with('child_directories')
        .get()
    }
  },
  watch: {
    descendantNotes() {
      this.setDescendantNotes(this.descendantNotes)
    }
  },
  created() {
    this.setDescendantNotes(this.descendantNotes)
  },
  methods: {
    ...mapMutations('notes', ['setFocusDirectory', 'setDescendantNotes'])
  }
}
</script>

<style scoped lang="sass">
.main
  margin-left: 3px
  white-space: nowrap
  font-size: 0.8em
  .directory-control
    display: inline-block
    .open-button
      position: relative
      top: -1px
      cursor: pointer
      .directory-icon
      .directory_close
        transform: rotate(-90deg)
        transform-origin: 50% 50%;
  .directory-name
    display: inline-block
    cursor: pointer
    &:hover
      font-weight: 600
  .directory-active
    cursor: pointer
    background-color: #6a6a6a
    border-radius: 10px
    color: #fff
    font-weight: 600
    padding: 0 4px
    &:hover
      color: #fff
      font-weight: 600
</style>
