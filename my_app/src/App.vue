<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view />
    <button @click="NoteCRUD.createNote('.', 'aaa.txt')">
      Oファイル新規作成
    </button>
    <button @click="fs_wrapper.moveFile('.', 'aaa.txt', 'testtest')">
      Oファイル移動
    </button>
    <button @click="fs_wrapper.renameFile('.', 'aaa.txt', 'bbb.txt')">
      Oファイル名前変更
    </button>
    <button @click="fs_wrapper.deleteFile('.', 'aaa.txt')">ファイル削除</button>
    <button @click="fs_wrapper.createDirectory('.', 'testtest')">
      Oフォルダ新規作成
    </button>
    <button @click="fs_wrapper.moveDirectory('.', 'testtest', 'testtest2')">
      Oフォルダ移動
    </button>
    <button @click="fs_wrapper.renameDirectory('.', 'testtest', 'testtest2')">
      Oフォルダ名前変更
    </button>
    <button @click="fs_wrapper.deleteDirectory('.', 'testtest')">
      フォルダ削除
    </button>
  </div>
</template>

<script>
import * as fs_wrapper from "./components/fs_wrapper.js";
import * as NoteCRUD from "./components/NoteCRUD";

export default {
  data: function() {
    return {
      number: 10,
      fs_wrapper: fs_wrapper,
      NoteCRUD: NoteCRUD
    };
  },
  methods: {}
};
</script>

<style></style>
