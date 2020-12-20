<template>
  <div class="tags">
    <div v-if="tags.length > 0" class="note-tags">
      <div v-for="tag in tags" :key="tag.id" class="tag">
        <Tag
          :name="tag.name"
          @tag-change="updateTag($event, tag.name)"
          @pass-delete-tag="deleteTag(tag.name)"
        />
      </div>
    </div>
    <div v-show="!isEditing" class="tag-add-button" @click="initCreatingTag"></div>
    <div v-show="isEditing" class="tag-add-input">
      <input
        ref="createInput"
        v-model="new_tag"
        type="text"
        @keypress.enter="createTag(), endCreatingTag()"
        @blur="endCreatingTag"
      />
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
  data: function() {
    return {
      new_tag: '',
      isEditing: false
    }
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
      let header = {
        title: this.note.title,
        category: this.note.category.name,
        tags: this.tags.map(tag => tag.name).concat(tagName)
      }
      setHeader(
        header,
        this.note.parent_directory_path_from_root,
        this.note.file_name
      )
    },
    updateTag(printingName, tagName) {
      printingName = printingName.trim()
      if (printingName == '') return
      let header = {
        title: this.note.title,
        category: this.note.category.name,
        tags: this.tags.map(tag => {
          return tag.name == tagName ? printingName : tag.name
        })
      }
      setHeader(
        header,
        this.note.parent_directory_path_from_root,
        this.note.file_name
      )
    },
    deleteTag(tagName) {
      let header = {
        title: this.note.title,
        category: this.note.category.name,
        tags: this.tags.map(tag => tag.name).filter(tag => tag !== tagName)
      }
      setHeader(
        header,
        this.note.parent_directory_path_from_root,
        this.note.file_name
      )
    },
    endCreatingTag() {
      this.isEditing = false
      this.new_tag = ''
    }
  }
}
</script>

<style scoped lang="scss">
.tags {
  .note-tags {
    display: inline-block;
    height: 26px;
    top: 1px;
    position: relative;
    .tag {
      display: inline-block;
      margin-right: 5px;
    }
  }
  .tag-add-button {
    background-color: #ddd;
    display: inline-block;
    vertical-align: middle;
    width: 23px;
    height: 23px;
    border-radius: 50%;
    padding: 1px;
    &:hover {
      cursor: pointer;
      background-color: #99ffcc;
    }
  }
  .tag-add-input {
    background-color: #ddd;
    padding: 0 5px;
    border-radius: 10px;
    input {
      border-radius: 10px;
      border: none;
      outline: 0;
    }
    display: inline-block;
  }
}
</style>
