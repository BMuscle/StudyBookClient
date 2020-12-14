export default {
  namespaced: true,
  state: {
    descendantNotes: [],
    filteredNotes: [],
    focusNote: 1
  },
  mutations: {
    setDescendantNotes(state, inodes) {
      state.descendantNotes = inodes
    },
    setFilteredNotes(state, inodes) {
      state.filteredNotes = inodes
    },
    setFocusNote(state, inodes) {
      state.focusNote = inodes
    }
  }
}
