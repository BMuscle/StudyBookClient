import { Model } from '@vuex-orm/core'

export default class Mylist extends Model {
  static entity = 'mylists'
  static primaryKey = ['id']

  static fields() {
    return {
      id: this.uid()
    }
  }
}
