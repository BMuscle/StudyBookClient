import { Model } from '@vuex-orm/core'

export default class DeletedLocalNote extends Model {
  static entity = 'deleted_local_notes'
  static primaryKey = ['guid']

  static fields() {
    return {
      guid: this.string()
    }
  }
}
