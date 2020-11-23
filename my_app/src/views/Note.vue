<template>
  <div class="main">
    <NoteLeftBar/>
    <div>
      内部要素はここへ
    </div>
  </div>
</template>

<script>
import NoteLeftBar from './NoteLeftBar'
export default {
  components: {
    NoteLeftBar,
  }
}
</script>

<style scoped lang="scss">
.main {
  height: calc(100% - 32px);
}
</style>
