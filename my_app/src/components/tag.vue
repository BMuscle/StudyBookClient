<template>
  <div>
    <div v-show="onFocus">
      <input
        v-model="printingName"
        @focus="focus"
        @keydown.enter="confirmTagEditing"
        @blur="cancelTagEditing"
        ref="textInput"
      />
    </div>
    <div class="tag" v-show="!onFocus">
      <div @click="enableFocus">{{ name }}</div>
      <button type="button" @click="noticeDelete">削除</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String
  },
  data: function() {
    return {
      onFocus: false,
      printingName: this.name
    };
  },
  methods: {
    focus: function() {
      this.onFocus = true;
    },
    confirmTagEditing() {
      this.$emit("tag-change", this.printingName);
      this.$refs.textInput.blur();
    },
    cancelTagEditing: function() {
      this.printingName = this.name;
      this.onFocus = false;
    },
    async enableFocus() {
      await (this.onFocus = true);
      this.$refs.textInput.focus();
    },
    noticeDelete: function() {
      this.$emit("pass-delete-tag", this.name);
    }
  },
  watch: {
    name(newName) {
      if (this.onFocus === false) {
        this.printingName = newName;
      }
    }
  }
};
</script>

<style>
</style>
