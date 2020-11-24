/* eslint-disable vue/order-in-components */
<template>
  <div class="demo">
    <ul>
      <li></li>
    </ul>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import Note from '@/models/Note'
//import
export default {
  computed: {
    ...mapState('notes', {
      filteredNotes: state => state.filteredNotes
    })
  },
  methods: {
    ...mapMutations('notes', ['setFilteredNotes'])
  },
  created: function() {
    this.setFilteredNotes([1])
    console.log(this.filteredNotes)
  }
}
</script>

<style></style>
