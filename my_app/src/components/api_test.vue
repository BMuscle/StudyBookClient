<template>
  <div>
    <div>
      <form>
        <div>
          <label for="email"> Eメール </label>
          <input type="email" v-model="email" id="email">
        </div>
        <div>
          <label for="password"> パスワード </label>
          <input type="password" v-model="password" id="email">
        </div>
        <button type="button" @click=createToken()>トークン登録</button>
      </form>
      <div>トークン確認 {{token}}</div>
      <div>UserId確認 {{user_id}}</div>
    </div>
    <div>
      <form>
        <div>
          <label for="title"> タイトル </label>
          <input type="text" v-model="note.title" id="title">
        </div>
        <div>
          <label for="text"> テキスト </label>
          <textarea v-model="note.text" id="title" rows="5" />
        </div>
        <div>
          <label for="category_id"> カテゴリーID </label>
          <input type="text" v-model="note.category_id" id="category_id">
        </div>
        <button type="button" @click=createNote()>ノート作成テスト</button>
      </form>
      <div>
        <p>GUID {{note.guid}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from './api'
import axios from 'axios'

export default {
  data: function() {
    return {
      email: "admin@example.com",
      password: "password",
      token: null,
      user_id: null,
      res: null,
      note: { local_id: 1, guid: null, title: "", text: "", category_id: null, tags: [{ id: "", name: "テストタグ名" }] }
    }
  },
  computed: {
    getAuthParams: function() {
      return { id: this.user_id, token: this.token}
    }
  },
  methods: {
    createToken() {
      api.post('/api/v1/users/token', { email: this.email, password: this.password })
      .then((response) => {
        this.token = response.data.token
        this.user_id = response.data.user_id
      })
    },
    createNote() {
      api.post('/api/v1/notes/uploads', { ...this.getAuthParams, notes: [this.note] }).then((response) => (this.note.guid = response.data[0].guid))
    }
  }
}
</script>

<style>

</style>
