import { Model } from '@vuex-orm/core'

export default class NoteTag extends Model {
  static entity = 'note_tag'
  static primaryKey = ['tag_id', 'note_inode']

  static fields() {
    return {
      tag_id: this.number(),
      note_inode: this.number()
    }
  }
}
