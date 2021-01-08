export default {
  namespaced: true,
  state: {
    agentGuid: null,
    token: null
  },
  getters: {
    info(state) {
      return state
    }
  },
  mutations: {
    setUser(state, { agentGuid, token }) {
      state.agentGuid = agentGuid
      state.token = token
    },
    reset(state) {
      state.agentGuid = null
      state.token = null
    }
  }
}
