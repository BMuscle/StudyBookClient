<template>
  <div :style="{ display: 'flex' }">
    <Data :name="'Note'" :data="notes" />
    <Data :name="'Directory'" :data="directories" />
    <Data :name="'DeletedLocalNote'" :data="deletedLocalNotes" />
    <Data :name="'NoteMylist'" :data="noteMylists" />
    <Data :name="'Mylist'" :data="mylists" />
    <Data :name="'Category'" :data="categories" />
    <Data :name="'NoteTag'" :data="noteTags" />
    <Data :name="'Tag'" :data="tags" />
  </div>
</template>

<script>
import Data from '@/components/Data'
import Note from '@/models/Note'
import Directory from '@/models/Directory'
import DeletedLocalNote from '@/models/DeletedLocalNote'
import NoteMylist from '@/models/NoteMylist'
import Mylist from '@/models/Mylist'
import Category from '@/models/Category'
import NoteTag from '@/models/NoteTag'
import Tag from '@/models/Tag'

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
    deletedLocalNotes() {
      return this.getAllRecursive(DeletedLocalNote)
    },
    noteMylists() {
      return this.getAllRecursive(NoteMylist)
    },
    mylists() {
      return this.getAllRecursive(Mylist)
    },
    categories() {
      return this.getAllRecursive(Category)
    },
    noteTags() {
      return this.getAllRecursive(NoteTag)
    },
    tags() {
      return this.getAllRecursive(Tag)
    }
  },
  methods: {
    getAllRecursive(table) {
      return table
        .query()
        .withAllRecursive()
        .get()
    }
  }
}
</script>

<style></style>
