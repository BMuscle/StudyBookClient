<template>
  <div :style="{ display: 'flex' }">
    <Data :name="'Note'" :data="notes" />
    <Data :name="'Directory'" :data="directories" />
    <Data :name="'MyListNoteIndex'" :data="myListNoteIndexs" />
    <Data :name="'MyListNoteTag'" :data="myListNoteTags" />
    <Data :name="'MyListNote'" :data="myListNotes" />
    <Data :name="'MyList'" :data="my_lists" />
    <Data :name="'Category'" :data="categories" />
    <Data :name="'NoteTag'" :data="noteTags" />
    <Data :name="'Tag'" :data="tags" />
    <Data :name="'UpdatedAt'" :data="updatedAts" />
  </div>
</template>

<script>
import Data from './Data'
import Note from '../models/Note'
import Directory from '../models/Directory'
import MyListNoteIndex from '../models/MyListNoteIndex'
import MyListNote from '../models/MyListNote'
import MyListNoteTag from '../models/MyListNoteTag'
import MyList from '../models/MyList'
import Category from '../models/Category'
import NoteTag from '../models/NoteTag'
import Tag from '../models/Tag'
import UpdatedAt from '../models/UpdatedAt'

export default {
  components: {
    Data
  },
  computed: {
    notes() {
      return this.getAllRecursive(Note)
    },
    directories() {
      return this.getAllRecursive(Directory)
    },
    myListNoteIndexs() {
      return this.getAllRecursive(MyListNoteIndex)
    },
    myListNotes() {
      return this.getAllRecursive(MyListNote)
    },
    myListNoteTags() {
      return this.getAllRecursive(MyListNoteTag)
    },
    my_lists() {
      return this.getAllRecursive(MyList)
    },
    categories() {
      return this.getAllRecursive(Category)
    },
    noteTags() {
      return this.getAllRecursive(NoteTag)
    },
    tags() {
      return this.getAllRecursive(Tag)
    },
    updatedAts() {
      return this.getAllRecursive(UpdatedAt)
    }
  },
  methods: {
    getAllRecursive(table) {
      return table
        .query()
        .withAll()
        .get()
    }
  }
}
</script>

<style></style>
