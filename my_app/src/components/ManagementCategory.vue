<template>
  <div>
    <imput @change = "setCategory" v-bind:text="category"/>
  </div>
</template>

<script>
export default {
  name:{
    ""
  },
  computed: {
    category() {
      return this.$store.state.category;
    }
  },
  methods: {
    setCategory(value) {
      this.$store.commit("set_category", value);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
