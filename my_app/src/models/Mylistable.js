import { Model } from '@vuex-orm/core'

export default class Mylistable extends Model {
  static entity = 'mylistables'
  static primaryKey = ['id']

  static fields() {
    return {
      id: this.uid(),
      mylist_id: this.attr(null),
      mylistable_id: this.attr(null),
      mylistable_type: this.attr(null)
    }
  }
}
