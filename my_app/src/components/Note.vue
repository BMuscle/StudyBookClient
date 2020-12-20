<template>
  <div class="note">
    <div v-if="note != null">
      <div class="header">
        <div class="file-path">
          {{ note.parent_directory_path_from_root.split('/').join(' > ') }} >
          {{ note.title }}
        </div>
        <div class="category">
          <DisplayTheNoteCategory
            :note-category="note.category"
            @category-change="updateCategory($event)"
          />
        </div>
        <div class="tags">
          <Tags
            :note="note"
            :tags="note.tags"
            @tag-create="createTag($event)"
            @tag-change="updateTag($event)"
            @tag-delete="deleteTag($event)"
          />
        </div>
      </div>
      <DisplayMd class="body" :md-data="noteBody" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DisplayMd from './DisplayMd.vue'
import Note from '@/models/Note'
import DisplayTheNoteCategory from './DisplayTheNoteCategory.vue'
import Tags from './Tags.vue'
import { readNoteBody, setHeader } from './NoteCRUD'

export default {
  components: {
    DisplayMd,
    DisplayTheNoteCategory,
    Tags
  },
  data: function() {
    return {
      noteBody: ''
    }
  },
  computed: {
    ...mapState('notes', {
      focusNote: state => state.focusNote
    }),
    note() {
      let note = Note.query()
        .whereId(this.focusNote)
        .with('category')
        .with('tags')
        .with('parent_directory')
        .first()
      if (note == null) return
      return note
    }
  },
  watch: {
    note(newNote) {
      this.setNote(newNote)
    }
  },
  created() {
    if (this.note != null) {
      this.setNote(this.note)
    }
  },
  methods: {
    setNote(note) {
      readNoteBody(note.parent_directory_path_from_root, note.file_name).then(response => {
        this.noteBody = response
      })
    },
    updateCategory(category) {
      const header = this.note.header
      header.category = category
      this.overwriteNoteHeader(header)
    },
    createTag(tagName) {
      const header = this.note.header
      header.tags = header.tags.concat(tagName)
      this.overwriteNoteHeader(header)
    },
    updateTag({ index, tagName }) {
      const header = this.note.header
      header.tags[index] = tagName
      this.overwriteNoteHeader(header)
    },
    deleteTag(index) {
      const header = this.note.header
      header.tags.splice(index, 1)
      this.overwriteNoteHeader(header)
    },
    overwriteNoteHeader(header) {
      setHeader(header.toString, this.note.parent_directory_path_from_root, this.note.file_name)
    }
  }
}
</script>

<style scoped lang="scss">
.note {
  .header {
    background-color: #5eaaa8;
    height: 32px;
    font-size: 0.8em;
    padding: 3px 10px;
    white-space: nowrap;
    .file-path {
      vertical-align: middle;
      display: inline-block;
      color: #e5e5e5;
      margin-right: 10px;
    }
    .category {
      display: inline-block;
    }
    .tags {
      display: inline-block;
    }
  }
  .body {
    padding: 10px 30px 20px 30px;
  }
}
</style>
