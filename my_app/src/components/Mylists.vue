<template>
  <div>
    <div v-for="mylist in mylists" :key="mylist.id">
      <div @click="this.$emit('mylistsClick', mylist.id)">
        {{ mylist.title }}
      </div>
    </div>
  </div>
</template>

<script>
import Mylist from '@/models/Mylist'

export default {
  components: {},
  data: function() {
    return {}
  },
  computed: {
    mylists() {
      return Mylist.query().get()
    }
  },
  methods: {}
}
</script>

<style></style>
