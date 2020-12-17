<template>
  <div class="section">
    <div>
      <SearchMyLists />
      <MylistsFilterByCategory />
    </div>
    <div class="my-lists overflow-auto">
      <MyLists @my-list-click="onMyListClick" />
    </div>
    <hr />
    <div class="my-list overflow-auto">
      <MyList
        v-if="choiced"
        :my-list-id="choicedMyListId"
        @noteClick="onNoteClick"
      />
    </div>
  </div>
</template>

<script>
import MyList from './MyList'
import MyLists from './MyLists'
import SearchMyLists from './SearchMyLists'
import MylistsFilterByCategory from './MylistsFilterByCategory'

export default {
  components: {
    MyList,
    MyLists,
    SearchMyLists,
    MylistsFilterByCategory
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

<style scoped lang="scss">
.section {
  min-height: 100%;
  height: 100%;
  .my-lists {
    max-height: 45%;
    height: 45%;
    border-radius: 3px;
  }
  hr {
    margin: 5px 0;
  }
  .my-list {
    border-radius: 3px;
    height: 45%;
    max-height: 45%;
    background-color: #e8ded2;
  }
}
</style>
