<template>
  <div id="app">
    <APITest/>
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
import APITest from './components/api_test';

// 全体で共通のコンポーネント
export default {
  store,
  components: {
    APITest
  }
}
</script>

<style></style>
