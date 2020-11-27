import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core'
import createPersistedState from 'vuex-persistedstate'
import md_header from './md_header'
import notes from './notes'
import database from '../database'

export default createStore({
  plugins: [
    VuexORM.install(database)
    // createPersistedState({
    //   paths: [
    //     'entities.notes',
    //     'entities.mylists',
    //     'entities.note_mylist',
    //     'entities.categories',
    //     'entities.tags',
    //     'entities.note_tag',
    //     'entities.deleted_local_notes',
    //     'entities.user',
    //     'entities.updated_at'
    //   ]
    // })
  ],
  state: {},
  mutations: {},
  actions: {},
  modules: {
    md_header,
    notes
  }
})
