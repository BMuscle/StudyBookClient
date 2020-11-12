import { Model } from '@vuex-orm/core'
import Note from './Note'
import NoteMylist from './NoteMylist'

export default class Mylist extends Model {
  static entity = 'mylists'
  static primaryKey = ['id']

  static fields() {
    return {
      id: this.uid(),
      title: this.string(),
      description: this.string(),
      notes: this.belongsToMany(Note, NoteMylist, 'mylist_id', 'note_id')
    }
  }
}
