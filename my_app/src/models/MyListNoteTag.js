import { Model } from '@vuex-orm/core'

export default class MyListNoteTag extends Model {
  static entity = 'my_list_note_tag'
  static primaryKey = ['tag_id', 'my_list_note_id']

  static fields() {
    return {
      tag_id: this.attr(),
      my_list_note_id: this.attr()
    }
  }
}
