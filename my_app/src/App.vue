<template>
  <div id="app">
    <router-link to="/">
      Home
    </router-link>
    <router-link to="/about">
      About
    </router-link>
    <router-view />
    <display_md :md_data="text"/>
  </div>
</template>

<script>
// 全体で共通のコンポーネント
import display_md from "./components/display_md.vue"

export default {
  data:function(){
    return{
      text:"# Vue.js" + "## Vue.jsとは？" + "Webサイトなどを作る**JavaScript**のフレームワーク。" + "JavaScriptを多用し、HTML/CSSが少し出てきます。"
    }
  },
  components:{
    display_md
  }
}
</script>

<style>
</style>
