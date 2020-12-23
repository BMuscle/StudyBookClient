<template>
  <div class="directory-tree-list">
    <div v-for="directory in directories" :key="directory.inode">
      <div class="directory-control">
        <div
          v-if="directory.child_directories.length != 0"
          @click="toggleDirectory(directory.inode)"
          class="open-button"
        >
          <img src="../images/folder_icon.png" width="13" height="13" class="directory-icon" :class="{ directory_close: !isOpen(directory.inode)}" />
        </div>
        <div v-else class="none-button" />
      </div>
      <div @click="clickDirectory(directory.path_from_root)" class="directory-name">
        {{ directory.directory_name }}
      </div>
      <DirectoryTreeList
        v-if="
          directory.child_directories.length != 0 && isOpen(directory.inode)
        "
        :directories="childDirectories(directory.inode)"
      />
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import DirectoryTreeList from './DirectoryTreeList.vue'
import Directory from '@/models/Directory'

export default {
  name: 'DirectoryTreeList',
  components: {
    DirectoryTreeList
  },
  props: {
    directories: Object
  },
  data: function() {
    return {
      openDirectories: []
    }
  },
  methods: {
    ...mapMutations('notes', ['setDescendantNotes']),
    clickDirectory: function(path_from_root) {
      let inodes = []
      let directories = Directory.query()
        .with('notes')
        .where('path_from_root', path => path.indexOf(path_from_root) == 0)
        .get()
      for (let directory of directories) {
        for (let note of directory.notes) {
          inodes.push(note.inode)
        }
      }
      this.setDescendantNotes(inodes)
    },
    childDirectories(inode) {
      return Directory.query()
        .where('parent_inode', inode)
        .with('child_directories')
        .get()
    },
    toggleDirectory(inode) {
      if (this.openDirectories.indexOf(inode) == -1) {
        this.openDirectories.push(inode)
      } else {
        var index = this.openDirectories.indexOf(inode)
        this.openDirectories.splice(index)
      }
    },
    isOpen(inode) {
      if (this.openDirectories.indexOf(inode) != -1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="sass">
.directory-tree-list
  margin-left: 8px
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
    .none-button
      width: 13px
  .directory-name
    margin-left: 3px
    display: inline-block
</style>
