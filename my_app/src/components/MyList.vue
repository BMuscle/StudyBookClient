<template>
  <div class="my-list">
    <div v-for="my_list_note in my_list_notes" :key="my_list_note.id" @click="clickMyListNote(my_list_note.id)" class="my-list-note">
      <div  class="title">
        {{ my_list_note.title }}
      </div>
      <div class="body">
        {{ my_list_note.body }}
      </div>
      <div class="info">
        <div class="category">
          {{ my_list_note.category.name }}
        </div>
        <div class="tags" v-if="my_list_note.tags.length > 0">
          <MyListNoteTags :tags="my_list_note.tags" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyListNoteIndex from '../models/MyListNoteIndex'
import { mapMutations } from 'vuex'
import MyListNoteTags from './MyListNoteTags.vue'

export default {
  components: {
    MyListNoteTags,
  },
  props: {
    myListId: Number
  },
  computed: {
    my_list_notes() {
      return MyListNoteIndex.query()
        .with('note')
        .with('note.category')
        .with('note.tags')
        .where('my_list_id', this.myListId)
        .orderBy('index', 'asc')
        .get().map( myListNoteIndex => { return myListNoteIndex.note })
    },
  },
  methods: {
    ...mapMutations('my_lists', ['setFocusMyListNote', 'setFocusMyList']),
    clickMyListNote(id) {
      this.setFocusMyList(this.myListId)
      this.setFocusMyListNote(id)
    }
  }
}
</script>

<style scoped lang="scss">
.my-list {
  padding: 5px 7px;
  height: 100%;
  .my-list-note {
    border-radius: 3px;
    cursor: pointer;
    background-color: #fff;
    padding: 1px 2px;
    border-top: solid 1px rgba(0,0,0,0.1);
    &:first-child {
      border-top: none;
    }
    .title {
      font-weight: 600;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 0.8em;
    }
    .body {
      margin-top: 1px;
      font-size: 0.75em;
      color: #6a6a6a;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      line-height: 14px;
    }
    .info {
      margin-top: 1px;
      overflow: hidden;
      white-space: nowrap;
      font-size: 0.65em;
      .category {
        display: inline-block;
        padding: 1px 5px;
        border-radius: 10px;
        color: #6a6a6a;
        background-color: #caffe6;
        margin-right: 3px;
      }
      .tags {
        display: inline-block;
      }
    }
  }
}
</style>
