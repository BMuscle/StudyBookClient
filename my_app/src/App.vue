<template>
  <div id="app">
    <MylistsSection />
  </div>
</template>

<script>
import data from '@/data'
import store from '@/store'
import Mylist from '@/models/Mylist'
import MylistsSection from '@/components/MylistsSection'

// 全体で共通のコンポーネント
export default {
  store,
  components: {
    MylistsSection
  },
  data() {
    return {}
  },
  created() {
    const initialData = data
    Mylist.insert({ data: initialData })
  }
}
</script>

<style></style>
