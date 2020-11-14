import { Model } from '@vuex-orm/core'

export default class Tag extends Model {
  static entity = 'tags'
  static primaryKey = ['id']

  static fields() {
    return {
      id: this.number(),
      online_id: this.number(),
      name: this.string()
    }
  }
}
