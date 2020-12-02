import { Model } from '@vuex-orm/core'
import store from '../store'

export default class Category extends Model {
  static entity = 'categories'
  static primaryKey = 'online_id'

  static fields() {
    return {
      online_id: this.number(),
      name: this.string()
    }
  }
  static getCategory(name) {
    const category = Category.query()
      .where('name', name)
      .first()
    return category ?? store.getters['category_module/get_default']
  }
}

export const category_module = {
  namespaced: true,
  state: {
    default_id: 0
  },
  getters: {
    get_default(state) {
      return Category.find(state.default_id)
    },
    get_category(state, getters) {
      return name => {
        const category = Category.query()
          .where('name', name)
          .first()
        return category ?? getters.get_default
      }
    }
  },
  mutations: {
    set_default_id(state, default_id) {
      state.default_id = default_id
    }
  },
  actions: {
    set_default_id({ commit }, default_id) {
      commit('set_default_id', default_id)
    }
  }
}
