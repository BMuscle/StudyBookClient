/* eslint-disable vue/order-in-components */
<template>
  <div class="demo">
    <ul>
      note
      <div v-for="note in notes" :key="note.inode">
        <li>
          {{ note.title }}
          <div v-for="tag in note.tags" :key="tag.id">
            {{ tag.name }}
          </div>
          <div v-if="note.category">
            {{ note.category.name }}
          </div>
        </li>
      </div>
    </ul>
    <NoteSort @filterd-notes="Sort = $event" />
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'

import Tag from '@/models/Tag'
import Category from '@/models/Category'
import NoteTag from '@/models/NoteTag'
import Note from '@/models/Note'
import NoteSort from '../components/NoteSort.vue'
//import
export default {
  components: {
    NoteSort
  },
  data: function() {
    return {
      Sort: '' //デフォルト
    }
  },
  computed: {
    ...mapState('notes', {
      filteredNotes: state => state.filteredNotes
    }),
    notes() {
      return Note.query()
        .whereIdIn(this.filteredNotes)
        .with('category')
        .with('tags')
        .orderBy('inode', this.Sort)
        .get()
    }
  },
  created: function() {
    this.initialize()
    this.setFilteredNotes([1, 2, 3, 4, 5, 6])
  },
  methods: {
    ...mapMutations('notes', ['setFilteredNotes']),
    initialize() {
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
    }
  }
}
</script>

<style></style>
