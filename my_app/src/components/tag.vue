<template>
  <div class="tag" v-on:click="changeTag()">
    {{name}}
  </div>
</template>

<script>
export default {
  props: {
    name: String
  },
  methods: {
    changeTag: function() {
      this.$emit('input', "変更後タグ名")
    },
  },
}
</script>

<style>
</style>
