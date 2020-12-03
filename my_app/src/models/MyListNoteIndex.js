import { Model } from '@vuex-orm/core'

export default class MyListNoteIndex extends Model {
  static entity = 'my_list_note_index'
  static primaryKey = ['my_list_id', 'my_list_note_id']

  static fields() {
    return {
      my_list_id: this.attr(),
      my_list_note_id: this.attr(),
      index: this.number()
    }
  }
}
