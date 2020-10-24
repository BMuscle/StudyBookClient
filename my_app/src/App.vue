<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view />
    <ManagementCategory />
    <ManagementCategory />
  </div>
</template>

<script>
// 全体で共通のコンポーネント
import ManagementCategory from "./components/ManagementCategory.vue";

export default {
  components:{
    ManagementCategory
  }
};
</script>

<style>
</style>
