import { Model } from '@vuex-orm/core'

export default class NoteMylist extends Model {
  static entity = 'note_mylist'
  static primaryKey = ['mylist_id', 'note_inode']

  static fields() {
    return {
      id: this.uid(),
      mylist_id: this.attr(),
      note_inode: this.attr(),
      index: this.number()
    }
  }
}
