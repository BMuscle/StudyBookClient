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
      var rows = md_text.split(/\r\n|\n/);

      for (const row of rows) {
        if (row === "") {
          break
        }
        const columns = row.split(/:/)
        switch (columns[0]) {
          case "title":
            commit('set_title', columns[1])
            break
          case "category":
            commit('set_category', columns[1])
            break
          case "tags":
            commit('set_tags', columns[1].split(/,/))
            break
        }
      }
    }
  }
}
