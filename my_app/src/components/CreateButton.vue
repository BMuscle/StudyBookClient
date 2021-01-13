<template>
  <div>
    <button @click="Create">新規作成ボタン</button>
  </div>
</template>

<script>
import { Create } from './NoteMethods'
export default {
  methods: {
    async Create() {
      Create()
    }
  }
}
</script>

<style></style>
