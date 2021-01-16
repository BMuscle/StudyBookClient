<template>
  <div class="tag">
    <div v-show="onFocus" class="tag-edit">
      <input
        ref="textInput"
        v-model="printingName"
        list="tags"
        @focus="focus"
        @keypress.enter="confirmTagEditing"
        @blur="cancelTagEditing"
      />
      <datalist id="tags">
        <option v-for="tag in allTagData" :key="tag.id">
          {{ tag.name }}
        </option>
      </datalist>
    </div>
    <div v-show="!onFocus" class="tag-view" @click="enableFocus">
      <label>{{ name }}</label>
      <div class="delete" @click="noticeDelete">×</div>
    </div>
  </div>
</template>

<script>
import TagData from '../models/Tag'

export default {
  props: {
    name: String
  },
  data: function() {
    return {
      onFocus: false,
      printingName: this.name
    }
  },
  computed: {
    allTagData() {
      return TagData.all()
    }
  },
  watch: {
    name(newName) {
      if (this.onFocus === false) {
        this.printingName = newName
      }
    }
  },
  methods: {
    focus: function() {
      this.onFocus = true
    },
    confirmTagEditing() {
      this.$emit('tag-change', this.printingName)
      this.$refs.textInput.blur()
    },
    cancelTagEditing: function() {
      this.printingName = this.name
      this.onFocus = false
    },
    async enableFocus(e) {
      if (e.target.closest('.delete')) return
      await (this.onFocus = true)
      this.$refs.textInput.focus()
    },
    noticeDelete: function() {
      this.$emit('pass-delete-tag')
    }
  }
}
</script>

<style scoped lang="scss">
.tag {
  padding: 1px 5px;
  background-color: #ddd;
  border-radius: 10px;
  &:hover {
    background-color: #cfcccf;
    cursor: pointer !important;
  }
  .tag-edit {
    input {
      border-radius: 10px;
      border: none;
      outline: 0;
      &:focus {
        outline: 0;
      }
    }
  }
  .tag-view {
    label {
      margin: 0;
      &:hover {
        background-color: #cfcccf;
        cursor: pointer !important;
      }
    }
    .delete {
      display: inline-block;
      padding-left: 5px;
      font-weight: 900;
      &:hover {
        cursor: pointer;
        color: #fff;
      }
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
