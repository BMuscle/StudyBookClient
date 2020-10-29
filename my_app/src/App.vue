<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view />

    <label>ParentDirectoryPath</label>
    <input type="text" v-model="parentDirectoryPath" />
    <br />

    <label>FileName</label>
    <input type="text" v-model="fileName" />
    <br />

    <label>DirectoryName</label>
    <input type="text" v-model="directoryName" />
    <br />

    <label>Content</label>
    <input type="text" v-model="content" />
    <br />

    <label>DestinationDirectoryPath</label>
    <input type="text" v-model="destinationDirectoryPath" />
    <br />

    <label>NewFileName</label>
    <input type="text" v-model="newFileName" />
    <br />

    <label>NewDirectoryName</label>
    <input type="text" v-model="newDirectoryName" />
    <br />

    <button @click="this.createNote">ノート新規作成</button>
    <button @click="overwriteNote">ノート上書き</button>
    <button @click="moveNote">ノート移動</button>
    <button @click="renameNote">ノート名前変更</button>
    <button @click="deleteNote">ノート削除</button>
    <button @click="createDirectory">フォルダ新規作成</button>
    <button @click="moveDirectory">フォルダ移動</button>
    <button @click="renameDirectory">フォルダ名前変更</button>
    <button @click="deleteDirectory">フォルダ削除</button>
  </div>
</template>

<script>
import * as fs_wrapper from "./components/fs_wrapper.js";
import * as NoteCRUD from "./components/NoteCRUD";

export default {
  data: function() {
    return {
      fs_wrapper: fs_wrapper,
      NoteCRUD: NoteCRUD,
      parentDirectoryPath: "",
      fileName: "",
      directoryName: "",
      content: "",
      destinationDirectoryPath: "",
      newFileName: "",
      newDirectoryName: ""
    };
  },
  methods: {
    createNote() {
      NoteCRUD.createNote(this.parentDirectoryPath, this.fileName);
    },
    overwriteNote() {
      NoteCRUD.overwriteNote(
        this.parentDirectoryPath,
        this.fileName,
        this.content
      );
    },
    moveNote() {
      NoteCRUD.moveNote(
        this.parentDirectoryPath,
        this.fileName,
        this.destinationDirectoryPath
      );
    },
    renameNote() {
      NoteCRUD.renameNote(
        this.parentDirectoryPath,
        this.fileName,
        this.newFileName
      );
    },
    deleteNote() {
      NoteCRUD.deleteNote(this.parentDirectoryPath, this.fileName);
    },
    createDirectory() {
      NoteCRUD.createDirectory(this.parentDirectoryPath, this.directoryName);
    },
    moveDirectory() {
      NoteCRUD.moveDirectory(
        this.parentDirectoryPath,
        this.directoryName,
        this.destinationDirectoryPath
      );
    },
    renameDirectory() {
      NoteCRUD.renameDirectory(
        this.parentDirectoryPath,
        this.directoryName,
        this.newDirectoryName
      );
    },
    deleteDirectory() {
      NoteCRUD.deleteDirectory(this.parentDirectoryPath, this.directoryName);
    }
  }
};
</script>

<style>
</style>
