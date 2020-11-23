<template>
  <div class="main">
    <MyListLeftBar/>
    <div>
      内部要素はここへ
    </div>
  </div>
</template>

<script>
import MyListLeftBar from './MyListLeftBar'
export default {
  components: {
    MyListLeftBar,
  }
}
</script>

<style scoped lang="scss">
.main {
  height: calc(100% - 32px);
}
</style>
