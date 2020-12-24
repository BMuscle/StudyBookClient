/* eslint-disable vue/order-in-components */
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
    <div @click="initialize()" class="directory-name">
      ノート
    </div>
    <DirectoryTreeList v-if="directories.length != 0 && isOpen" :directories="directories" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
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
    directories() {
      return Directory.query()
        .where('parent_inode', null)
        .with('child_directories')
        .get()
    }
  },
  methods: {
    ...mapMutations('notes', ['setDescendantNotes']),
    initialize() {
      let inodes = Note.queryExists()
        .get()
        .map(note => note.inode)
      this.setDescendantNotes(inodes)
    }
  },
  mounted: function() {
    this.initialize()
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
</style>
