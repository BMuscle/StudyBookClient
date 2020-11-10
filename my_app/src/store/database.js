import { Model } from 'vuex-orm'

export class User extends Model {
  // Vuexのステートのキー名を指定する。
  static entity = 'users'

  // ユーザデータの構造とリレーションを定義する。
  static fields() {
    return {
      id: this.attr(null),
      title: this.attr(''),
      body: this.attr(''),
      posts: this.hasMany(Post, 'user_id')
    }
  }
}

export class Post extends Model {
  static entity = 'posts'

  static fields() {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      title: this.attr(''),
      body: this.attr(''),
      author: this.belongsTo(User),
      comments: this.hasMany(Comment)
    }
  }
}
