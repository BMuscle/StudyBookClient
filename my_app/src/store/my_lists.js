export default {
  namespaced: true,
  state: {
    filteredMyLists: [],
    focusMyList: null,
    focusMyListNote: null,
    searchParams: '',
    sort: []
  },
  mutations: {
    setFilteredMyLists(state, ids) {
      state.filteredMyLists = ids
    },
    setFocusMyList(state, id) {
      state.focusMyList = id
    },
    setFocusMyListNote(state, id) {
      state.focusMyListNote = id
    },
    setSearchParams(state, params) {
      state.searchParams = params
    },
    setSort(state, sort) {
      state.sort = sort
    }
  }
}
