<template>
  <div>
    <div class="el-modal" :aria-hidden="isOpen ? 'false' : 'true'">
      <div class="el-modal__holder">
        <form>
          <div>
            <label for="email"> Eメール </label>
            <input id="email" v-model="email" type="email" />
          </div>
          <div>
            <label for="password"> パスワード </label>
            <input id="email" v-model="password" type="password" />
          </div>
          <button type="button" @click="createToken()">ログイン</button>
        </form>
        <button @click="close()">閉じる</button>
      </div>
      <div class="el-modal__overlay"></div>
    </div>
    <button v-if="user" @click="logOut()">ログアウト</button>
    <button v-else @click="open()">ログイン</button>
  </div>
</template>

<script>
// このコンポーネントですること
// ユーザログイン処理 データがなければ、ログインを行うコンポーネントを作る。（ポップアップ表示→ログインさせる）
import api from './api'
import axios from 'axios'
import User from '@/models/User'

export default {
  name: 'Modal',
  data: function() {
    return {
      isOpen: false,
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
    open: function() {
      this.isOpen = true
    },
    close: function() {
      this.isOpen = false
    },
    createToken() {
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
          this.close()
        })
    },
    logOut() {
      User.deleteAll()
    }
  }
}
</script>

<style lang="scss">
.el-modal {
  visibility: hidden;
}

.el-modal__holder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  z-index: 1100;
  background-color: #fff;
  width: 400px;
  height: 300px;
}

.el-modal__overlay {
  position: fixed;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
}

.el-modal[aria-hidden='false'] {
  visibility: visible;
}
</style>
