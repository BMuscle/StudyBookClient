<template>
  <div>
    <div v-for="note in notes" :key="note.inode">
      <div @click="this.$emit('noteClick', note.inode)">
        {{ note.title }}
      </div>
    </div>
  </div>
</template>

<script>
import Mylist from '../models/Mylist'

export default {
  components: {},
  props: {
    mylistId: String
  },
  data: function() {
    return {}
  },
  computed: {
    notes() {
      const mylist = Mylist.query()
        .with('notes')
        .find(this.mylistId)
      const notes = mylist.notes
      return notes
    }
  },
  methods: {}
}
</script>

<style></style>
