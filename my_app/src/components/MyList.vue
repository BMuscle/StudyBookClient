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
import MyList from '../models/MyList'

export default {
  components: {},
  props: {
    myListId: String
  },
  data: function() {
    return {}
  },
  computed: {
    notes() {
      const my_list = MyList.query()
        .with('notes')
        .find(this.myListId)
      const notes = myList.notes
      return notes
    }
  },
  methods: {}
}
</script>

<style></style>
