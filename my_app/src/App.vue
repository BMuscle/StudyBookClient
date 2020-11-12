<template>
  <div id="app">
    <router-link to="/">
      Home
    </router-link>
    <router-link to="/about">
      About
    </router-link>
    <router-view />
  </div>
</template>

<script>
import store from '@/store'

// 全体で共通のコンポーネント
export default {
  store
}
</script>

<style></style>
