<template>
  <div id="app">
    <router-link to="/">
      Home
    </router-link>
    <router-link to="/about">
      About
    </router-link>
    <router-view />
    <filterdNotes />
  </div>
</template>

<script>
import store from '@/store'
import filterdNotes from './components/filterdNotes.vue'

// 全体で共通のコンポーネント
export default {
  store,
  components: {
    filterdNotes
  }
}
</script>

<style></style>
