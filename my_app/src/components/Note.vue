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
  },
  created: function() {
    Category.insert({
      data: {
        online_id: 1,
        name: 'aaa'
      }
    }),
      Category.insert({
        data: {
          online_id: 2,
          name: 'bbb'
        }
      }),
      Category.insert({
        data: {
          online_id: 3,
          name: 'ccc'
        }
      }),
      Category.insert({
        data: {
          online_id: 4,
          name: 'ddd'
        }
      }),
      Category.insert({
        data: {
          online_id: 5,
          name: 'eee'
        }
      }),
      Category.insert({
        data: {
          online_id: 6,
          name: 'fff'
        }
      }),
      Note.insert({
        data: {
          inode: 1,
          parent_inode: 281474978815900,
          title: 'aaa',
          category_id: 1
        }
      }),
      Note.insert({
        data: {
          inode: 2,
          parent_inode: 281474978815900,
          title: 'bbb'
        }
      }),
      Note.insert({
        data: {
          inode: 3,
          parent_inode: 281474978815900,
          title: 'ccc'
        }
      }),
      Note.insert({
        data: {
          inode: 4,
          parent_inode: 281474978815900,
          title: 'ddd'
        }
      }),
      Note.insert({
        data: {
          inode: 5,
          parent_inode: 281474978815900,
          title: 'eee'
        }
      }),
      Note.insert({
        data: {
          inode: 6,
          parent_inode: 281474978815900,
          title: 'fff'
        }
      }),
      Tag.insert({
        data: {
          online_id: 1,
          id: 1,
          name: 'aaa'
        }
      }),
      Tag.insert({
        data: {
          online_id: 2,
          id: 2,
          name: 'bbb'
        }
      }),
      NoteTag.insert({
        data: {
          tag_id: 1,
          note_inode: 2
        }
      })
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
