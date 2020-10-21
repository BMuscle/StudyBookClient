import { createStore } from "vuex";

export default createStore({
  state: {
    title: "",
    category: "test1234",
    tags: []
  },
  getters: {
    category(state) {
      return state.category;
    }
  },
  mutations: {
    set_title(value) {
      this.$state.title = value
    },
    set_category(value) {
      this.$state.category = value
    },
    set_tags(value) {
      this.$state.tags = value
    }
  }
});
