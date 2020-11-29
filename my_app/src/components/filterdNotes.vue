/* eslint-disable vue/order-in-components */
<template>
  <div class="demo">
    <ul>
      note
      <div v-for="note in notes" :key="note.inode">
        <li>
          {{ note.title }}
          ここから {{ note.parent_directory_path_from_root }} ここまで
          <div v-for="tag in note.tags" :key="tag.id">
            {{ tag.name }}
          </div>
          <div v-if="note.category">
            {{ note.category.name }}
          </div>
        </li>
      </div>
    </ul>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'

import Tag from '@/models/Tag'
import Category from '@/models/Category'
import NoteTag from '@/models/NoteTag'
import Note from '@/models/Note'
//import
export default {
  computed: {
    ...mapState('notes', {
      filteredNotes: state => state.filteredNotes
    }),
    notes() {
      return Note.query()
        .whereIdIn(this.filteredNotes)
        .with('category')
        .with('tags')
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
            title: 'aaa',
            category_id: 1
          }
        }),
        Note.insert({
          data: {
            inode: 2,
            title: 'bbb'
          }
        }),
        Note.insert({
          data: {
            inode: 3,
            title: 'ccc'
          }
        }),
        Note.insert({
          data: {
            inode: 4,
            title: 'ddd'
          }
        }),
        Note.insert({
          data: {
            inode: 5,
            title: 'eee'
          }
        }),
        Note.insert({
          data: {
            inode: 6,
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
