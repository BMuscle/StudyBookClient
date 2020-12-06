export default {
  namespaced: true,
  state: {
    userId: null,
    token: null
  },
  getters: {
    info(state) {
      return state
    }
  },
  mutations: {
    setUser(state, { userId, token }) {
      state.userId = userId
      state.token = token
    },
    reset(state) {
      state.userId = null
      state.token = null
    }
  }
}
