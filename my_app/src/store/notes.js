export default {
  namespaced: true,
  state: {
    descendantNotes: []
  },
  mutations: {
    setDescendantNotes(state, inodes) {
      state.descendantNotes = inodes
    }
  }
}
