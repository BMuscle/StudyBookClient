<template>
  <div id="app">
    <router-link to="/">
      Home
    </router-link>
    <router-link to="/about">
      About
    </router-link>
    <router-view />
    <DirectoryTreeView />
  </div>
</template>

<script>
import store from '@/store'
import DirectoryTreeView from './components/DirectoryTreeView.vue'

// 全体で共通のコンポーネント
export default {
  store,
  components: {
    DirectoryTreeView
  }
}
</script>

<style></style>
