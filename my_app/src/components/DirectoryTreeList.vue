<template>
  <div class="demo">
    <ul>
      <div v-for="directory in directories" :key="directory.inode">
        <li>
          <div
            v-if="directory.child_directories.length != 0"
            @click="toggleDirectory(directory.inode)"
          >
            開閉ボタン
          </div>
          <div @click="out(directory.path_from_root)">
            {{ directory.directory_name }}
          </div>
          <DirectoryTreeList
            v-if="
              directory.child_directories.length != 0 && isOpen(directory.inode)
            "
            :directories="childDirectories(directory.inode)"
          />
        </li>
      </div>
    </ul>
  </div>
</template>
<script>
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
    out: function(name) {
      console.log(name)
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

<style></style>
