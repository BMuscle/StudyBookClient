/* eslint-disable vue/order-in-components */
<template>
  <div class="demo">
    <ul>
      <li>
        <div v-if="directories.length != 0" @click="isOpen = !isOpen">
          開閉ボタン
        </div>
        <div @click="initialize()">
          Notes
        </div>
        <DirectoryTreeList
          v-if="directories.length != 0 && isOpen"
          :directories="directories"
        />
      </li>
    </ul>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import DirectoryTreeList from './DirectoryTreeList.vue'
import Directory from '@/models/Directory'
import Note from '@/models/Note'
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
      let inodes = []
      let directories = Directory.query()
        .with('notes')
        .get()
      for (let directory of directories) {
        for (let note of directory.notes) {
          inodes.push(note.inode)
        }
      }
      this.setDescendantNotes(inodes)
    }
  },
  mounted: function() {
    Directory.insert({
      data: {
        inode: 1,
        parent_inode: null,
        directory_name: 'app',
        path_from_root: 'app'
      }
    }),
      Directory.insert({
        data: {
          inode: 2,
          parent_inode: 1,
          directory_name: 'test',
          path_from_root: 'app/test'
        }
      }),
      Directory.insert({
        data: {
          inode: 3,
          parent_inode: 2,
          directory_name: 'test2',
          path_from_root: 'app/test/test2'
        }
      }),
      Directory.insert({
        data: {
          inode: 4,
          parent_inode: null,
          directory_name: 'hoge',
          path_from_root: 'hoge'
        }
      }),
      Directory.insert({
        data: {
          inode: 5,
          parent_inode: 1,
          directory_name: 'huga',
          path_from_root: 'app/huga'
        }
      }),
      Directory.insert({
        data: {
          inode: 6,
          parent_inode: 3,
          directory_name: 'test3',
          path_from_root: 'app/test/test2/test3'
        }
      })
    this.initialize()
  }
}
</script>

<style></style>
