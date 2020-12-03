<template>
  <div class="demo">
    <div v-if="note != null">
      {{ note.parent_directory_path_from_root }}/{{ note.title }}
      <!-- <Tags :name="testTag" /> -->
      <DisplayMd :md-data="noteBody" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DisplayMd from './DisplayMd.vue'
import Note from '@/models/Note'
import Tag from '@/models/Tag'
import Category from '@/models/Category'
import NoteTag from '@/models/NoteTag'

import Tags from './Tag.vue'
export default {
  components: {
    DisplayMd,
    Tags
  },
  data: function() {
    return {
      testTag: 'aaaa' //仮tag
    }
  },
  computed: {
    ...mapState('notes', {
      focusNote: state => state.focusNote
    }),
    note() {
      return Note.query()
        .whereId(this.focusNote)
        .with('category')
        .with('tags')
        .with('parent_directory')
        .first()
    },
    noteBody() {
      //  後々、本文読み込みに変更
      return this.note.parent_directory_path_from_root
    }
  }
}
</script>

<style scoped></style>
