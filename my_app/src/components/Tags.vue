<template>
  <div class="tags">
    <div v-if="tags.length > 0" >
      <div  v-for="tag in tags" :key="tag">
        <Tag
          :name="tag.name"
          @tag-change="updateTag($event, tag.name)"
          @pass-delete-tag="deleteTag(tag.name)"
        />
      </div>
    </div>
    <div>
      <button v-show="!isEditing" @click="initCreatingTag">
        タグ追加ボタン（仮）
      </button>
      <div v-show="isEditing">
        <input
          ref="createInput"
          v-model="new_tag"
          type="text"
          @keypress.enter="createTag(), endCreatingTag()"
          @blur="endCreatingTag"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tag from './Tag'
import Note from '@/models/Note'
import { setHeader } from './NoteCRUD'

export default {
  components: {
    Tag
  },
  props: {
    note: Object
  },
  computed: {
    tags() {
      return this.note.tags
    }
  },
  methods: {
    async initCreatingTag() {
      await (this.isEditing = true)
      this.$refs.createInput.focus()
    },
    createTag() {
      let tagName = this.new_tag.trim()
      if (tagName == '') return
      let header = { title: this.note.title, category: this.note.category.name , tags: this.tags.map(tag => tag.name).concat(tagName)}
      setHeader(header, this.note.parent_directory_path_from_root, this.note.file_name)
    },
    updateTag(printingName, tagName) {
      printingName = printingName.trim()
      if (printingName == '') return
      let header = { title: this.note.title, category: this.note.category.name , tags: this.tags.map(tag => { return tag.name == tagName ? printingName : tag.name })}
      setHeader(header, this.note.parent_directory_path_from_root, this.note.file_name)
    },
    deleteTag(tagName) {
      let header = { title: this.note.title, category: this.note.category.name , tags: this.tags.map(tag => tag.name).filter(tag => tag !== tagName)}
      setHeader(header, this.note.parent_directory_path_from_root, this.note.file_name)
    },
    endCreatingTag() {
      this.isEditing = false
      this.new_tag = ''
    }
  },
  data: function() {
    return {
      new_tag: '',
      isEditing: false
    }
  },
}
</script>

<style></style>
