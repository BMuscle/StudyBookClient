<template>
  <div class="my-lists">
    <MyListSort @mylist-sort="sort = $event.split(',', 2)" />
    <div v-for="myList in myLists" :key="myList.id" @click="setMyList(myList.id)" class="my-list">
      <div class="title" v-html="highLight(myList.title)" />
      <div class="category">
        <div class="category-name">
          {{ myList.category.name }}
        </div>
      </div>
      <div class="description" v-html="highLight(myList.description)" />
    </div>
  </div>
</template>

<script>
import MyList from '../models/MyList'
import { mapState } from 'vuex'
import MyListSort from './MyListSort.vue'

export default {
  components: {
    MyListSort
  },
  data: function(){
    return {
      sort: []
    }
  },
  computed: {
    ...mapState('my_lists', {
      searchParams: state => state.searchParams
    }),
    myLists() {
      return MyList.query()
        .where(myList => { return (myList.title.includes(this.searchParams) || this.includeDescription(myList)) })
        .with('notes')
        .with('category')
        .orderBy(this.sort[0], this.sort[1])
        .get()
    }
  },
  methods: {
    setMyList(myListId) {
      this.$emit('my-list-click', myListId)
    },
    includeDescription(myList) {
      for(let param of this.searchParams.split(' ')) {
        if(!myList.description.includes(param)) return false;
      }
      return true;
    },
    highLight(text) {
      return text.replace(this.searchParams, `<b>${this.searchParams}</b>`)
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
      font-weight: 400;
    }
    .category {
      margin-top: -5px;
      .category-name {
        display: inline-block;
        font-size: 0.7em;
        background-color: #caffe6;
        color: #6a6a6a;
        border-radius: 20px;
        padding: 1px 8px;
      }
    }
    .description {
      font-size: 0.7em;
      color: #6a6a6a;
    }
  }
}
</style>
