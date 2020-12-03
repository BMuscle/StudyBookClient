<template>
  <div>
    <MyLists @myListClick="onMyListClick" />
    <MyList
      v-if="choiced"
      :myListId="choicedMyListId"
      @noteClick="onNoteClick"
    />
  </div>
</template>

<script>
import MyList from './MyList'
import MyLists from './MyLists'

export default {
  components: {
    MyList,
    MyLists
  },
  data: function() {
    return {
      choicedMyListId: NaN,
      choiced: false
    }
  },
  computed: {},
  methods: {
    onMyListClick(event) {
      this.choicedMyListId = event
      this.choiced = true
    },
    onNoteClick(event) {
      this.$emit('note-click', event)
    }
  }
}
</script>

<style></style>
