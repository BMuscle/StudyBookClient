<template>
  <div class="directory-tree-list">
    <div v-for="directory in directories" :key="directory.inode">
      <div class="directory-control">
        <div
          v-if="directory.child_directories.length != 0"
          class="open-button"
          @click="toggleDirectory(directory.inode)"
        >
          <img
            src="../images/folder_icon.png"
            width="13"
            height="13"
            class="directory-icon"
            :class="{ directory_close: !isOpen(directory.inode) }"
          />
        </div>
        <div v-else class="none-button" />
      </div>
      <div class="directory-name" @click="setFocusDirectory(directory.inode)" :class="focusDirectory == directory.inode ? 'directory-active' : '' ">
        {{ directory.directory_name }}
      </div>
      <DirectoryTreeList
        v-if="directory.child_directories.length != 0"
        v-show="isOpen(directory.inode)"
        :directories="childDirectories(directory.inode)"
      />
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import DirectoryTreeList from './DirectoryTreeList.vue'
import Directory from '../models/Directory'

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
  computed: {
    ...mapState('notes', ['focusDirectory'])
  },
  methods: {
    ...mapMutations('notes', ['setFocusDirectory']),
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
        this.openDirectories.splice(index, 1)
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
