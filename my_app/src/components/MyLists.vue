<template>
  <div class="my-lists">
    <div v-for="myList in myLists" :key="myList.id" @click="setMyList(myList.id)" class="my-list">
      <div class="title">
        {{ myList.title }}
      </div>
      <div class="category">
        {{ myList.category.name }}
      </div>
    </div>
  </div>
</template>

<script>
import MyList from '../models/MyList'

export default {
  components: {},
  computed: {
    myLists() {
      return MyList.query().with('category').all()
    }
  },
  methods: {
    setMyList(myListId) {
      this.$emit('my-list-click', myListId)
    }
  }
}
</script>

<style scoped lang="scss">
.my-lists {
  background-color: #fff;
  height: 100%;
  min-height: 100%;
  .my-list {
    background-color: #fff;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    padding: 3px 5px;
    border-top: solid 1px rgba(0,0,0,0.1);
    &:first-child {
      border-top: none;
    }
    .title {
      font-weight: 600;
    }
    .category {
      display: inline-block;
      font-size: 0.8em;
      background-color: #caffe6;
      color: #6a6a6a;
      border-radius: 20px;
      padding: 1px 8px;
    }
  }
}
</style>
