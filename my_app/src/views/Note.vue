<template>
  <div class="main">
    <NoteLeftBar/>
    <div class="note">
      <Note class="overflow-auto"/>
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
.note {
  position:relative;
  height: 100%;
}
</style>
