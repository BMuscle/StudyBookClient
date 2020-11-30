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
    my_listId: String
  },
  data: function() {
    return {}
  },
  computed: {
    notes() {
      const my_list = MyList.query()
        .with('notes')
        .find(this.my_listId)
      const notes = my_list.notes
      return notes
    }
  },
  methods: {}
}
</script>

<style></style>
