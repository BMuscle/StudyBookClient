import { Model } from '@vuex-orm/core'

export default class Tag extends Model {
  static entity = 'tags'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.uid(),
      online_id: this.number().nullable(),
      name: this.string()
    }
  }
}
