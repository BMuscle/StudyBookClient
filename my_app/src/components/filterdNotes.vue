<template>
  <div class="filterd-notes">
    <NoteSort @filterd-notes="sort = $event.split(',', 2)" />
    <div class="notes overflow-auto">
      <div v-for="note in notes" :key="note.inode" class="note" @click="setFocusNote(note.inode)">
        <div @dblclick="OpenEditor(note.parent_directory_path_from_root, note.file_name)">
          <div class="title">
            {{ note.title }}
          </div>
          <div class="info">
            <div v-if="note.category" class="category">
              {{ note.category.name }}
            </div>
            <div class="tags">
              <div v-for="tag in note.tags" :key="tag.id" class="tag">
                {{ tag.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Note from '@/models/Note'
import NoteSort from '../components/NoteSort.vue'
import { shell } from 'electron'
import path from 'path'
import { notesJoin } from './NoteCRUD'

export default {
  components: {
    NoteSort
  },
  data: function() {
    return {
      sort: [],
      fullPath: ''
    }
  },
  computed: {
    ...mapState('notes', {
      filteredNotes: state => state.filteredNotes,
      focusNote: state => state.focusNote
    }),
    notes() {
      return Note.query()
        .whereIdIn(this.filteredNotes)
        .with('category')
        .with('tags')
        .orderBy(this.sort[0], this.sort[1])
        .get()
    }
  },
  methods: {
    ...mapMutations('notes', ['setFocusNote']),
    OpenEditor(filePath, noteName) {
      this.fullPath = notesJoin(filePath, noteName)
      shell.openPath(this.fullPath)
    }
  }
}
</script>

<style scoped lang="sass">
.filterd-notes
  height: calc(50% - 50px)
  max-height: calc(50% - 50px)
  margin-top: 5px
  .notes
    margin-top: 5px
    font-size: 0.8em
    background-color: #fff
    border-radius: 5px
    max-height: 80%
    height: 80%
    .note
      border-radius: 3px
      cursor: pointer
      background-color: #fff
      padding: 1px 2px
      border-top: solid 1px rgba(0,0,0,0.1)
      &:first-child
        border-top: none
    .title
      font-weight: 600
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      font-size: 0.9em
    .info
      margin-top: 1px
      overflow: hidden
      white-space: nowrap
      font-size: 0.75em
      .category
        display: inline-block
        padding: 1px 5px
        border-radius: 10px
        color: #6a6a6a
        background-color: #caffe6
        margin-right: 3px
      .tags
        display: inline-block
        white-space: nowrap
        text-overflow: ellipsis;
        .tag
          padding: 1px 5px
          margin-right: 3px
          display: inline-block
          background-color: #ddd
          border-radius: 10px
</style>
