<template>
  <div class="main">
    <NoteLeftBar />
    <div>
      <Note />
    </div>
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
  height: calc(100% - 32px);
}
</style>
