<template>
  <div>
    <div v-for="myList in myLists" :key="myList.id">
      <div @click="this.$emit('myListClick', myList.id)">
        {{ myList.title }}
      </div>
    </div>
  </div>
</template>

<script>
import MyList from '../models/MyList'

export default {
  components: {},
  data: function() {
    return {}
  },
  computed: {
    myLists() {
      return MyList.all()
    }
  },
  methods: {}
}
</script>

<style></style>
