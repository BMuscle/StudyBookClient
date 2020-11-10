<template>
  <section>
    <button @click="add">追加</button>
    <div v-for="user in users" :key="user.id">
      <p>{{ user.name }}</p>
      <button @click="destroy(user)">削除</button>
    </div>
  </section>
</template>

<script>
import data from '@/data'
import store from '@/store'
import User from '@/models/User'

export default {
  store,
  computed: {
    users() {
      return User.query()
        .orderBy('id', 'desc')
        .get()
    }
  },
  created() {
    const initialData = data
    User.insert({ data: initialData })
  },
  methods: {
    add() {
      User.insert({
        data: { name: 'aaaaaaaaaaaa' }
      })
    },
    destroy(user) {
      user.$delete()
    }
  }
}
</script>

<style></style>
