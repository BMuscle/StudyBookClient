<template>
  <div>
    <div v-for="myList in myLists" :key="myList.id">
      <div @click="setMyList(myList.id)">
        {{ myList.title }}
      </div>
    </div>
  </div>
</template>

<script>
import MyList from '../models/MyList'
import { mapMutations } from 'vuex'

export default {
  components: {},
  computed: {
    myLists() {
      return MyList.all()
    }
  },
  methods: {
    ...mapMutations('my_lists', ['setFocusMyList']),
    setMyList(myListId) {
      this.setFocusMyList(myListId)
      this.$emit('my-list-click', myListId)
    }
  }
}
</script>

<style></style>
