<template>
  <div class="main">
    <div class="container body">
      <div v-if="isMessage" class="alert alert-danger">
        ログインに失敗しました
      </div>
      <h3 class="mt-2 mb-3">
        StudyBookへログイン
      </h3>
      <form>
        <div class="form-group">
          <label for="email"> Eメール </label>
          <input id="email" v-model="email" type="email" class="form-control" />
        </div>
        <div class="form-group">
          <label for="password"> パスワード </label>
          <input
            id="email"
            v-model="password"
            type="password"
            class="form-control"
          />
        </div>
        <button type="button" class="btn btn-primary" @click="createToken()">
          ログイン
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../components/api'
import axios from 'axios'
import User from '../models/User'

export default {
  name: 'Modal',
  data: function() {
    return {
      isMessage: false,
      email: null,
      password: null
    }
  },
  computed: {
    user() {
      return User.all()[0]
    }
  },
  methods: {
    createToken() {
      this.isMessage = false
      api
        .post('/api/v1/users/token', {
          email: this.email,
          password: this.password
        })
        .then(response => {
          User.deleteAll()
          User.insert({
            data: { user_id: response.data.user_id, token: response.data.token }
          })
          this.$router.push('/')
        })
        .catch(response => {
          this.isMessage = true
        })
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  position: absolute;
  top: 32px;
  background-color: #e8ded2;
  height: 100%;
  width: 100%;
}
.body {
  background-color: #fff;
  padding: 50px 40px;
  margin-top: 30px;
  border-radius: 20px;
}
</style>
