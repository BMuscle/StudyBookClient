export default {
  namespaced: true,
  state: {
    focusDirectory: null,
    descendantNotes: [],
    filteredNotes: [],
    focusNote: '',
    filteringCategoryId: null
  },
  mutations: {
    setFocusDirectory(state, inode) {
      state.focusDirectory = inode
    },
    setDescendantNotes(state, inodes) {
      state.descendantNotes = inodes
    },
    setFilteredNotes(state, inodes) {
      state.filteredNotes = inodes
    },
    setFocusNote(state, inodes) {
      state.focusNote = inodes
    },
    setfilteringCategoryId(state, categoryId) {
      state.filteringCategoryId = categoryId
    }
  }
}
