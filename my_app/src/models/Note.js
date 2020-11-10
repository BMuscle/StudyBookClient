import { Model } from '@vuex-orm/core'
import Mylist from './Mylist'
import Mylistable from './Mylistable'

export default class Note extends Model {
  static entity = 'notes'
  static primaryKey = ['id']

  static fields() {
    return {
      id: this.uid(),
      mylists: this.morphToMany(
        Mylist,
        Mylistable,
        'mylist_id',
        'mylistable_id',
        'mylistable_type'
      )
    }
  }
}
