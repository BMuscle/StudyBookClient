export default {
  namespaced: true,
  state: {
    descendantNotes: [],
    filteredNotes: []
  },
  mutations: {
    setDescendantNotes(state, inodes) {
      state.descendantNotes = inodes
    },
    setFilteredNotes(state, inodes) {
      state.filteredNotes = inodes
    }
  }
}
