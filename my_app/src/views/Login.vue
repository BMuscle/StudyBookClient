<template>
  <div class="main">
    <div class="container body">
      <div v-if="isMessage" class="alert alert-danger">
        ログインに失敗しました
      </div>
      <h3 class="mt-2 mb-3">
        StudyBookへログイン
      </h3>
      <form @submit.prevent="createToken()">
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
        <button type="submit" class="btn btn-primary">
          ログイン
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../components/api'
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'

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
    ...mapState('user', ['agentGuid', 'token'])
  },
  methods: {
    ...mapMutations('user', ['setUser', 'reset']),
    createToken() {
      this.isMessage = false
      api
        .post('/api/v1/users/token', {
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.reset()
          this.setUser({
            agentGuid: response.data.agent_guid,
            token: response.data.token
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
