<template>
  <div>
    <div v-for="my_list in my_lists" :key="my_list.id">
      <div @click="this.$emit('my_listClick', my_list.id)">
        {{ my_list.title }}
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
    my_lists() {
      return MyList.all()
    }
  },
  methods: {}
}
</script>

<style></style>
