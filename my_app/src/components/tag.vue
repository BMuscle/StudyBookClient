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
    <div class="tag" v-show="!onFocus" @click="enableFocus">
      {{ name }}
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
      tag: this.$store.state.tag,
      printingName: this.name
    };
  },
  methods: {
    focus: function() {
      this.onFocus = true;
    },
    confirmTagEditing: function() {
      this.$emit("tag-change", this.printingName);
    },
    cancelTagEditing: function() {
      this.printingName = this.name;
      this.onFocus = false;
    },
    async enableFocus() {
      await(this.onFocus = true)
      this.$refs.textInput.focus();
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
