export default {
  namespaced: true,
  state: {
    rootPath: null
  },
  mutations: {
    setRootPath(state, rootPath) {
      state.rootPath = rootPath
    }
  }
}
