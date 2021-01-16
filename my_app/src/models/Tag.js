import { Model } from '@vuex-orm/core'
import store from '@/store'
import Note from './Note'
import NoteTag from './NoteTag'
import MyListNote from './MyListNote'
import MyListNoteTag from './MyListNoteTag'

export default class Tag extends Model {
  static entity = 'tags'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(),
      online_id: this.number().nullable(),
      name: this.string(),
      notes: this.belongsToMany(Note, NoteTag, 'tag_id', 'note_inode', 'id', 'inode'),
      my_list_notes: this.belongsToMany(MyListNote, MyListNoteTag, 'tag_id', 'my_list_note_id')
    }
  }
  static hydrateId(record) {
    store.commit('tag_module/make_id')
    record.id ??= store.state.tag_module.last_id
    return record
  }
  static findByName(name) {
    return Tag.query()
      .where('name', name)
      .first()
  }
  static async insertTag(name) {
    const tag = Tag.findByName(name)
    if (tag !== null) {
      return tag.id
    }
    const entities = await Tag.insert({ data: Tag.hydrateId({ name: name }) })
    return entities.tags[0].id
  }
  static thatHaveNotes() {
    return this.query()
      .with('notes')
      .with('my_list_notes')
      .orderBy('name', 'asc')
      .get()
      .filter(record => record.notes.length != 0 || record.my_list_notes.length != 0)
  }
}

export const tag_module = {
  namespaced: true,
  state: {
    last_id: 0
  },
  mutations: {
    make_id(state) {
      ++state.last_id
    }
  }
}
