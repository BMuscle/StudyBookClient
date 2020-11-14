import { Model } from '@vuex-orm/core'

export default class NoteTag extends Model {
  static entity = 'note_tag'
  static primaryKey = ['tag_id', 'note_id']

  static fields() {
    return {
      id: this.uid(),
      tag_id: this.attr(null),
      note_id: this.attr(null)
    }
  }
}
