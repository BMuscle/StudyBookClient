<template>
  <div class="main">
    <NoteLeftBar />
    <Note />
  </div>
</template>

<script>
import NoteLeftBar from './NoteLeftBar'
import Note from '../components/Note.vue'
export default {
  components: {
    NoteLeftBar,
    Note
  }
}
</script>

<style scoped lang="scss">
.main {
  height: calc(100vh - 32px);
  max-width: 100%;
  overflow: hidden;
}
</style>
