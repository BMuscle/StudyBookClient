<template>
  <div class="tags">
    <div class="note-tags">
      <div v-for="(tag, index) in tags" :key="tag.id" class="tag">
        <Tag
          :name="tag.name"
          @tag-change="noticeChange(index, $event)"
          @pass-delete-tag="noticeDelete(index)"
        />
      </div>
      <div v-show="!isEditing" class="tag-add-button" @click="initCreatingTag"></div>
      <div v-show="isEditing" class="tag-add-input">
        <input
          ref="createInput"
          v-model="new_tag"
          type="text"
          list="tags"
          @keypress.enter="noticeCreate(), endCreatingTag()"
          @blur="endCreatingTag"
        />
        <datalist id="tags">
          <option v-for="tag in allTagData" :key="tag.id">
            {{ tag.name }}
          </option>
        </datalist>
      </div>
    </div>
  </div>
</template>

<script>
import Tag from './Tag'
import TagData from '../models/Tag'

export default {
  components: {
    Tag
  },
  props: {
    tags: Array
  },
  data: function() {
    return {
      new_tag: '',
      isEditing: false
    }
  },
  computed: {
    allTagData() {
      return TagData.all()
    }
  },
  methods: {
    async initCreatingTag() {
      await (this.isEditing = true)
      this.$refs.createInput.focus()
    },
    noticeCreate() {
      const tagName = this.new_tag.trim()
      if (tagName == '') return
      this.$emit('tag-create', tagName)
    },
    noticeChange(index, tagName) {
      tagName = tagName.trim()
      if (tagName == '') return
      this.$emit('tag-change', { index: index, tagName: tagName })
    },
    noticeDelete(index) {
      this.$emit('tag-delete', index)
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
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 0.9em;
  white-space: nowrap;
  .note-tags {
    display: inline-flex;
    align-items: center;
    height: 26px;
    .tag {
      display: inline-block;
      white-space: nowrap;
      margin-right: 2px;
    }
  }
  .tag-add-button {
    background-color: #ddd;
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
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
