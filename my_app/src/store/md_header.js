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
        const dataCategory = columns[0].trim()
        const data = columns[1].trim()

        switch (dataCategory) {
          case "title":
            commit('set_title', data)
            break
          case "category":
            commit('set_category', data)
            break
          case "tags":
            commit('set_tags', data.split(/,/).map(
              (tag) => tag.trim()
            ))
            break
        }
      }
    }
  }
}
