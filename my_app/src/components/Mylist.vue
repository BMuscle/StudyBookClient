<template>
  <div>
    <div v-for="note in notes" :key="note.id">
      <div @click="this.$emit('noteClick', note.id)">
        {{ note.title }}
      </div>
    </div>
  </div>
</template>

<script>
import Mylist from '@/models/Mylist'

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
        .where('id', this.mylistId)
        .get()[0]
      const notes = mylist['notes']
      return notes
    }
  },
  methods: {}
}
</script>

<style></style>
