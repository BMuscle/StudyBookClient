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
    set_title(state, value) {
      state.title = value
    },
    set_category(state, value) {
      state.category = value
    },
    set_tags(state, value) {
      state.tags = value
    }
  }
});
