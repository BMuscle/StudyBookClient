import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core'
import md_header from './md_header'
import database from '@/database'

export default createStore({
  plugins: [VuexORM.install(database)],
  state: {},
  mutations: {},
  actions: {},
  modules: {
    md_header
  }
})
