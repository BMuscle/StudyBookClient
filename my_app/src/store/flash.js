export default {
  namespaced: true,
  state: {
    flash: []
  },
  mutations: {
    setFlash(state, { key, messages }) {
      state.flash = []
      for(let message of messages) {
        state.flash.push({key: key, message: message})
      }
    },
    clearFlash(state) {
      state.flash = []
    }
  },
  actions: {
    setNotice({ commit }, messages) {
      commit('setFlash', { key: 'notice', messages: messages })
    },
    setSuccess({ commit }, messages) {
      commit('setFlash', { key: 'success', messages: messages })
    },
    setWarning({ commit }, messages) {
      commit('setFlash', { key: 'warning', messages: messages })
    },
    setDanger({ commit }, messages) {
      commit('setFlash', { key: 'danger', messages: messages })
    },
    setInfo({ commit }, messages) {
      commit('setFlash', { key: 'info', messages: messages })
    },
  }
}
