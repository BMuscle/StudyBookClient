<template>
  <div class="note" v-if="note?.is_exists">
    <div class="header" ref="note_header">
      <div class="row-1">
        <div class="file-path">
          {{ notePathStr }}
        </div>
        <div class="category">
          <DisplayTheNoteCategory
            :note-category="note.category"
            @category-change="updateCategory($event)"
          />
        </div>
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
    <div class="note-content" ref="note_content">
      <div class="title">{{note.title}}</div>
      <DisplayMd class="body" :md-data="noteBody" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DisplayMd from './DisplayMd.vue'
import Note from '@/models/Note'
import Directory from '@/models/Directory'
import DisplayTheNoteCategory from './DisplayTheNoteCategory.vue'
import Tags from './Tags.vue'
import { readNoteBody, setHeader } from './NoteCRUD'
import path from 'path'
import { throttle, debounce } from 'lodash'

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
    directories() {
      return Directory.query()
        .where('parent_inode', null)
        .with('child_directories')
        .get()
    },
    note() {
      const note = Note.query()
        .whereId(this.focusNote)
        .with('directory')
        .with('category')
        .with('tags')
        .with('parent_directory')
        .first()
      return note
    },
    notePathStr() {
      return path
        .join('Notes', this.note.parent_directory_path_from_root, this.note.file_name)
        .replace(/[\\/]/g, ' > ')
    }
  },
  watch: {
    note(newNote) {
      this.setNote(newNote)
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize: debounce(function() {
      if(this.note?.is_exists) {
        let el = this.$refs.note_content;
        let headerEl = this.$refs.note_header;
        el.style.height = `calc(100vh - ${headerEl.clientHeight + 32}px)`;
      }
    }, 10),
    setNote(note) {
      if (this.note?.is_exists) {
        readNoteBody(note.parent_directory_path_from_root, note.file_name).then(response => {
          this.noteBody = response
        })
      }
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
    max-height: 56.5px;
    // width: 100%;
    overflow: hidden;
    font-size: 0.8em;
    padding: 3px 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .row-1 {
      white-space: nowrap;
      .file-path {
        display: inline-block;
        color: #e5e5e5;
        margin-right: 10px;
      }
      .category {
        display: inline-block;
      }
    }
    .tags {
      display: inline-block;
      height: 100%;
    }
  }
  .note-content {
    overflow: auto;
    height: calc(100vh - 88px);
    white-space: nowrap;
    .title {
      font-size: 2em;
      font-weight: 600em;
    }
    .body {
      padding: 10px 30px 20px 30px;
    }
  }
}
</style>
