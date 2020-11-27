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

export function getCategory(name) {
  return name
    ? Category.query()
        .where('name', name)
        .first()
    : Category.query().find(0) //カテゴリー=未分類の online_id が決まってないので、暫定で 0
}
