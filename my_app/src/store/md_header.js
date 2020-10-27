export default {
  namespaced: true,
  state: {
    title: "",
    category: "",
    tags: []
  },
  mutations: {
    set_title(state, title) {
      state.title = title
    },
    set_category(state, category) {
      state.category = category
    },
    set_tags(state, tags) {
      state.tags = tags
    }
  },
  actions: {
    update({ commit }, md_text) {
      var arr = md_text.split(/\r\n|\n/);

      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
          break
        }
        const row = arr[i].split(/:/)
        switch (row[0]) {
          case "title":
            commit('set_title', row[1])
            break
          case "category":
            commit('set_category', row[1])
            break
          case "tags":
            commit('set_tags', row[1].split(/,/))
            break
        }
      }
    }
  }
}
