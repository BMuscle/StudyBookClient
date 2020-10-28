<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view />
    <button @Click="func">Click me!</button>
    {{ users }}
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
// 全体で共通のコンポーネント
export default {
  computed: {
    ...mapState("entities/posts", {
      users: state => state.users
    })
  },
  methods: {
    ...mapActions("entities/posts", ["create"]),
    func: () => {
      this.create({
        data: {
          id: 1,
          user_id: 1,
          title: "...",
          body: "...",
          author: { id: 1, name: "John Doe" }
        }
      });
    }
  }
};
</script>

<style>
</style>
