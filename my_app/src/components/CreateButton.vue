<template>
  <div>
    <div class="create-button" @click="Create">新規ノート作成</div>
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

<style lang="sass" scoped>
.create-button
  margin-top: 5px
  cursor: pointer
  width: 100%
  height: 20px
  background-color: #fff
  border-radius: 5px
  text-align: center
  font-size: 0.9em
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25)
  background-color: #D7FFFD
  &:hover
    font-weight: 600
    background-color: #b5cccb
</style>
