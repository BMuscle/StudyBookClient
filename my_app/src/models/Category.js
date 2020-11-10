import { Model } from '@vuex-orm/core'

export default class Category extends Model {
  static entity = 'categories'
  static primaryKey = ['id']

  static fields() {
    return {
      id: this.uid()
    }
  }
}
