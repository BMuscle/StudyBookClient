<template>
  <div>
    <div v-for="my_list_note in my_list_notes" :key="my_list_note.id">
      <div @click="clickMyListNote(my_list_note.id)">
        {{ my_list_note.title }}
      </div>
    </div>
  </div>
</template>

<script>
import MyList from '../models/MyList'
import { mapMutations } from 'vuex'

export default {
  components: {},
  props: {
    myListId: Number
  },
  computed: {
    my_list_notes() {
      return MyList.query()
        .with('notes')
        .find(this.myListId).notes
    },
  },
  methods: {
    ...mapMutations('my_lists', ['setFocusMyListNote']),
    clickMyListNote(id) {
      this.setFocusMyListNote(id)
    }
  }
}
</script>

<style></style>
