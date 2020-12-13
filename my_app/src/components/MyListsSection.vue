<template>
  <div>
    <MyLists @my-list-click="onMyListClick" />
    <MyList
      v-if="choiced"
      :my-list-id="choicedMyListId"
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
