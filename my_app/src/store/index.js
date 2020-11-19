import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core'
import createPersistedState from 'vuex-persistedstate'
import md_header from './md_header'
import database from '@/database'

export default createStore({
  plugins: [
    VuexORM.install(database),
    createPersistedState({
      paths: [
        'entities.notes',
        'entities.mylists',
        'entities.note_mylist',
        'entities.categories',
        'entities.tags',
        'entities.note_tag',
      ]
    })
  ],
  state: {},
  mutations: {},
  actions: {},
  modules: {
    md_header
  }
})
