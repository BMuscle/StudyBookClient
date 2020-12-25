export default {
  namespaced: true,
  state: {
    directories: []
  },
  mutations: {
    setDirectories(state, inodes) {
      state.directories = inodes
    }
  }
}
