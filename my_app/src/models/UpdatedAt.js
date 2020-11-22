import { Model } from '@vuex-orm/core'

/*
  # Label一覧
  - my_lists  マイリストの最終更新時間
  - tags タグの最終更新時間
  - categories カテゴリの最終更新時間
  - note_downloads ノートの最終取得時間（ downloadsにアクセスした時間なので注意 )
  - note_uploads ノートの最終更新時間（ uploadsにアクセスした時間なので注意 )
*/

export default class UpdatedAt extends Model {
  static entity = 'updated_at'
  static primaryKey = 'label'

  static fields() {
    return {
      label: this.string(),
      updated_at: this.attr(new Date().getTime()) // タイムスタンプを格納
    }
  }
}
