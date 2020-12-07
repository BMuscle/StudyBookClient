<template>
  <div class="note">
    <div v-if="note != null">
      {{ note.parent_directory_path_from_root }}/{{ note.title }}
      <Tags :note="note" />
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
import Tags from './Tags.vue'
import { readNoteBody } from './NoteCRUD'

export default {
  components: {
    DisplayMd,
    Tags
  },
  data: function() {
    return {
      testTag: 'aaaa', //仮tag
      noteBody: '',
    }
  },
  computed: {
    ...mapState('notes', {
      focusNote: state => state.focusNote
    }),
    note() {
      let note = Note.query()
        .whereId(50601103)
        .with('category')
        .with('tags')
        .with('parent_directory')
        .first()
      this.setNote(note)
      return note
    },
  },
  methods: {
    setNote(note) {
      readNoteBody(note.parent_directory_path_from_root, note.file_name).then(response =>{
        this.noteBody = response
      })
    }
  }
}
</script>

<style scoped lang="scss">
.note {
  padding: 20px 30px;
}
</style>
