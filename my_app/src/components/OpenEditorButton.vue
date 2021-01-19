<template>
  <div class="button" @click="openEditor">エディタで開く</div>
</template>

<script>
import { openEditor } from './NoteMethods'

export default {
  props: {
    directoryPath: String,
    fileName: String
  },
  methods: {
    async openEditor() {
      openEditor(this.directoryPath, this.fileName)
    }
  }
}
</script>

<style lang="sass" scoped>
.button
  cursor: pointer
  padding: 1px 3px
  width: 100%
  height: 20px
  background-color: #fff
  border-radius: 5px
  text-align: center
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25)
  background-color: #D7FFFD
  &:hover
    font-weight: 600
    background-color: #b5cccb
</style>
