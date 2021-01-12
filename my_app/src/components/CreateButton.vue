<template>
  <div>
    <button @click="Create">新規作成ボタン</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Directory from '../models/Directory'
import { Create } from './NoteMethods'
export default {
  computed: {
    ...mapState('notes', ['focusDirectory'])
  },
  methods: {
    async Create() {
      const selectedDir = Directory.find(this.focusDirectory)
      const path = selectedDir?.path_from_root ?? ''
      Create(path)
    }
  }
}
</script>

<style></style>
