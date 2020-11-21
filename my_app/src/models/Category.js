import { Model } from '@vuex-orm/core'

export default class Category extends Model {
  static entity = 'categories'
  static primaryKey = 'online_id'

  static fields() {
    return {
      online_id: this.number(),
      name: this.string()
    }
  }
}
