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

<style></style>
