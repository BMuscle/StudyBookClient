<template>
  <div class="demo">
    ここに置く
    <DisplayMd :md-data="textData" />
    <Tags :name="testTag" />

    <filterdNotes />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DisplayMd from './DisplayMd.vue'
import Note from '@/models/Note'
import filterdNotes from './filterdNotes.vue'

import Tags from './Tags.vue'
import notes from '../store/notes'
export default {
  components: {
    DisplayMd,
    Tags,
    filterdNotes
  },
  props: {
    textData: {
      type: String,
      default: '### まーくだうん (PROPSに直置き)'
    }
  },
  data: function() {
    return {
      testTag: 'aaaa' //仮tag
    }
  },
  computed: {
    ...mapState('notes', {
      filteredNotes: state => state.filteredNotes
    })
  },
  created: function() {
    console.log(notes.parent_directory_path_from_root)
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
