/* eslint-disable vue/order-in-components */
<template>
  <div class="demo">
    <ul>
      note
      <div v-for="note in notes" :key="note.inode">
        <li>
          <div @click="setFocusNote(note.inode)">
            {{ note.title }}
          </div>
          <div v-for="tag in note.tags" :key="tag.id">
            {{ tag.name }}
          </div>
          <div v-if="note.category">
            {{ note.category.name }}
          </div>
        </li>
      </div>
    </ul>
    <NoteSort @filterd-notes="sort = $event.split(',', 2)" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Note from '@/models/Note'
import NoteSort from '../components/NoteSort.vue'
import { getInode } from './fs_wrapper'

export default {
  components: {
    NoteSort
  },
  data: function() {
    return {
      sort: []
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
    ...mapMutations('notes', ['setFocusNote'])
  }
}
</script>

<style></style>
