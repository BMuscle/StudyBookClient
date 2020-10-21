<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view />
    <managamentcategory/>
  </div>
</template>

<script>
// 全体で共通のコンポーネント
import ManagementCategory from "./components/ManagementCategory.vue"
export default {
  conponents:{
    ManagementCategory
  }
}
</script>

<style>
</style>
