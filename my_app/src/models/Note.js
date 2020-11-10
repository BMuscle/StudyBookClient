import { Model } from '@vuex-orm/core'

export default class Note extends Model {
  static entity = 'notes'
  static primaryKey = ['id']

  static fields() {
    return {
      id: this.uid()
    }
  }
}
