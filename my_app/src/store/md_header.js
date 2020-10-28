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
      var title = ""
      var category = ""
      var tags = []

      for (const row of rows) {
        if (row === "") {
          break
        }
        const columns = row.split(/:/)
        const dataCategory = columns[0].trim()
        const data = columns[1].trim()

        switch (dataCategory) {
          case "title":
            title = data
            break
          case "category":
            category = data
            break
          case "tags":
            tags = data.split(/,/).map(tag => tag.trim())
            break
        }
      }
      commit("set_title", title)
      commit("set_category", category)
      commit("set_tags", tags)
    }
  }
}
