<template>
  <div>
    <Mylists @mylistClick="onMylistClick" />
    <Mylist
      v-if="choiced"
      :mylist-id="choicedMylistId"
      @noteClick="onNoteClick"
    />
  </div>
</template>

<script>
import Mylist from '@/components/Mylist'
import Mylists from '@/components/Mylists'

export default {
  components: {
    Mylist,
    Mylists
  },
  data: function() {
    return {
      choicedMylistId: NaN,
      choiced: false
    }
  },
  computed: {},
  methods: {
    onMylistClick(event) {
      this.choicedMylistId = event
      this.choiced = true
    },
    onNoteClick(event) {
      this.$emit('note-click', event)
    }
  }
}
</script>

<style></style>
