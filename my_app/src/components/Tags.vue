<template>
  <div class="tags">
    <div v-if="tags.length > 0" class="note-tags">
      <div v-for="(tag, index) in tags" :key="tag.id" class="tag">
        <Tag
          :name="tag.name"
          @tag-change="noticeChange(index, $event)"
          @pass-delete-tag="noticeDelete(index)"
        />
      </div>
    </div>
    <div v-show="!isEditing" class="tag-add-button" @click="initCreatingTag"></div>
    <div v-show="isEditing" class="tag-add-input">
      <input
        ref="createInput"
        v-model="new_tag"
        type="text"
        @keypress.enter="noticeCreate(), endCreatingTag()"
        @blur="endCreatingTag"
      />
    </div>
  </div>
</template>

<script>
import Tag from './Tag'

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
