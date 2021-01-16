import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core'
import createPersistedState from 'vuex-persistedstate'
import root from './root'
import notes from './notes'
import my_lists from './my_lists'
import { category_module } from '../models/Category'
import { tag_module } from '../models/Tag'
import user from './user'
import database from '../database'
import bookmark from './bookmark'
import flash from './flash'

export default createStore({
  plugins: [
    VuexORM.install(database),
    createPersistedState({
      paths: [
        'root',
        'notes',
        'bookmark',
        'my_lists',
        'category_module',
        'tag_module',
        'user',
        'entities.notes',
        'entities.my_lists',
        'entities.my_list_note',
        'entities.my_list_note_tag',
        'entities.my_list_note_index',
        'entities.categories',
        'entities.tags',
        'entities.note_tag',
        'entities.updated_at'
      ]
    })
  ],
  state: {},
  mutations: {},
  actions: {},
  modules: {
    root,
    notes,
    bookmark,
    my_lists,
    category_module,
    tag_module,
    user,
    flash
  }
})
