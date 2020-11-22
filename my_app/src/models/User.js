import { Model } from '@vuex-orm/core'

export default class User extends Model {
  static entity = 'user'
  static primaryKey = 'user_id'

  static fields() {
    return {
      user_id: this.number(),
      token: this.string()
    }
  }
  // get loginUser () { // 現状使用不可 原因不明
  //   return User.all()[0]
  // }
}
