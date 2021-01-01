<template>
  <div class="my-lists">
    <div v-for="myList in myLists" :key="myList.id" class="my-list" @click="setMyList(myList.id)">
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

export default {
  computed: {
    ...mapState('my_lists', {
      searchParams: state => state.searchParams,
      sort: state => state.sort,
      filteringCategoryId: state => state.filteringCategoryId
    }),
    data: function() {
      return {
        sort: String
      }
    },
    myLists() {
      return this.myListQueryFilteredInCategory()
        .with('notes')
        .with('category')
        .where(myList => {
          return myList.title.includes(this.searchParams) || this.includeDescription(myList)
        })
        .orderBy('title', this.sort)
        .get()
    }
  },
  methods: {
    myListQueryFilteredInCategory() {
      const myListQuery = MyList.query()
      return this.filteringCategoryId != null
        ? myListQuery.where('category_id', this.filteringCategoryId)
        : myListQuery
    },
    setMyList(myListId) {
      this.$emit('my-list-click', myListId)
    },
    includeDescription(myList) {
      for (let param of this.searchParams.split(' ')) {
        if (!myList.description.includes(param)) return false
      }
      return true
    },
    highLight(text) {
      const cleanText = this.sanitize(text)
      const sanitizedParams = this.sanitize(this.searchParams)
      return cleanText.replace(sanitizedParams, `<b>${sanitizedParams}</b>`)
    },
    sanitize(dirtyText) {
      return dirtyText.replace(/</g, '&lt').replace(/>/g, '&gt')
    }
  }
}
</script>

<style scoped lang="scss">
.my-lists {
  font-size: 0.8em;
  background-color: #fff;
  height: 100%;
  min-height: 100%;
  .my-list {
    background-color: #fff;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    padding: 3px 5px;
    border-top: solid 1px rgba(0, 0, 0, 0.1);
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
