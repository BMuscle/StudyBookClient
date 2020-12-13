import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core'
import createPersistedState from 'vuex-persistedstate'
import notes from './notes'
import my_lists from './my_lists'
import { category_module } from '../models/Category'
import user from './user'
import database from '../database'

export default createStore({
  plugins: [
    VuexORM.install(database)
    // createPersistedState({
    //   paths: [
    //     'user',
    //     'entities.notes',
    //     'entities.my_lists',
    //     'entities.my_list_note',
    //     'entities.my_list_note_tag',
    //     'entities.my_list_note_index',
    //     'entities.categories',
    //     'category_module',
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
    notes,
    my_lists,
    category_module,
    user
  }
})
