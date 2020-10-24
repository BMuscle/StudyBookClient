<template>
  <div>
    <input @input = "set_category($event.target.value)" :value="category"/>
  </div>
</template>

<script>
import { mapState, mapMutations} from "vuex";

export default {
  computed:mapState([
    "category"
  ]),
  methods:mapMutations([
    "set_category"
  ])
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
