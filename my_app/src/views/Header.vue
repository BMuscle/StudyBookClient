<template>
  <nav class="navbar navbar-expand navbar-dark">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <router-link :to="{ name: 'Note' }" class="nav-link" exact-active-class="active" >
          ノート
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'MyList' }" class="nav-link" exact-active-class="active" >
          マイリスト
        </router-link>
      </li>
      <li v-if="user" class="nav-item">
        <a @click="logOut()" class="nav-link">ログアウト</a>
      </li>
      <li v-else class="nav-item">
        <router-link :to="{ name: 'Login' }" class="nav-link" exact-active-class="active" >
         ログイン
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import User from '@/models/User'
export default {
  computed: {
    user() {
      return User.all()[0]
    }
  },
  methods: {
    logOut() {
      User.deleteAll()
    }
  }
}
</script>

<style scoped lang="scss">
.navbar {
  height: 32px;
  padding-top: 4px;
  padding-bottom: 4px;
  .nav-link {
    padding-top: 0;
    padding-bottom: 0;
  }
  background-color: #056676;
}
.router-link-active {
  font-weight: 700;
  color: #fff;
}
</style>
