<template>
  <div class="my-list-note">
    <div v-if="my_list_note != null">
      <div class="header">
        <div class="my-list-title">
          {{ my_list.title }}
        </div>
        <div class="my-list-colon">
          :
        </div>
        <div class="my-list-note-title">
          {{ my_list_note.title }}
        </div>
        <div class="my-list-note-category">
          {{ my_list_note.category.name }}
        </div>
        <div class="my-list-note-tags">
          <MyListNoteTags :tags="my_list_note.tags"/>
        </div>
      </div>
      <DisplayMd class="body" :md-data="my_list_note.body" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DisplayMd from './DisplayMd.vue'
import MyListNoteTags from './MyListNoteTags.vue'
import MyListNote from '@/models/MyListNote'
import MyList from '@/models/MyList'

export default {
  components: {
    DisplayMd,
    MyListNoteTags,
  },
  computed: {
    ...mapState('my_lists', {
      focusMyListNote: state => state.focusMyListNote,
      focusMyList: state => state.focusMyList
    }),
    my_list_note() {
      return MyListNote.query()
        .whereId(this.focusMyListNote)
        .with('category')
        .with('tags')
        .first()
    },
    my_list() {
      return MyList.find(this.focusMyList)
    }
  },
}
</script>

<style scoped lang="scss">
.my-list-note {
  .header {
    background-color: #5eaaa8;
    height: 32px;
    padding: 3px 10px;
    display: flex;
    align-items: center;
    .my-list-title {
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-size: 1em;
      font-weight: 600;
      vertical-align: middle;
      display: inline-block;
      color: #fff;
      margin-right: 5px;
    }
    .my-list-colon {
      font-size: 1em;
      font-weight: 600;
      vertical-align: middle;
      display: inline-block;
      color: #fff;
      margin-right: 5px;
    }
    .my-list-note-title {
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-size: 1em;
      font-weight: 600;
      vertical-align: middle;
      display: inline-block;
      color: #fff;
      margin-right: 10px;
    }
    .my-list-note-category {
      background-color: #caffe6;
      margin-right: 10px;
      color: #6a6a6a;
      border-radius: 20px;
      font-size: 0.9em;
      padding: 1px 5px
    }
    .my-list-note-tags {
      display: inline-block;
      font-size: 0.9em;
    }
  }
  .body {
    padding: 10px 30px 20px 30px;
  }
}
</style>
