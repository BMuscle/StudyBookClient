import { Model } from '@vuex-orm/core'
import Note from './Note'
import Mylistable from './Mylistable'

export default class Mylist extends Model {
  static entity = 'mylists'
  static primaryKey = ['id']

  static fields() {
    return {
      id: this.uid(),
      title: this.string(),
      description: this.string(),
      notes: this.morphedByMany(
        Note,
        Mylistable,
        'mylist_id',
        'mylistable_id',
        'mylistable_type'
      )
    }
  }
}
