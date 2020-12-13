<template>
  <div class="main">
    <MyListLeftBar />
    <div class="my-list-note">
      <MyListNote class="overflow-auto" />
    </div>
  </div>
</template>

<script>
import MyListLeftBar from './MyListLeftBar'
import MyListNote from '../components/MyListNote.vue'

export default {
  components: {
    MyListLeftBar,
    MyListNote,
  }
}
</script>

<style scoped lang="scss">
.main {
  height: calc(100% - 32px);
}
.my-list-note {
  height: 100%;
}
</style>
