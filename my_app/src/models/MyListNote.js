import { Model } from '@vuex-orm/core'
import Category from './Category'
import Tag from './Tag'
import MyListNoteTag from './MyListNoteTag'
import MyListNoteIndex from './MyListNoteIndex'
import MyList from './MyList'

export default class MyListNote extends Model {
  static entity = 'my_list_note'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.number(),
      title: this.string(),
      body: this.string(),
      nickname: this.string(),
      category_id: this.number(),
      category: this.belongsTo(Category, 'category_id', 'online_id'),
      tags: this.belongsToMany(
        Tag,
        MyListNoteTag,
        'my_list_note_id',
        'tag_id',
        'id',
        'id'
      ),
      my_lists: this.belongsToMany(
        MyList,
        MyListNoteIndex,
        'my_list_note_id',
        'my_list_id',
        'id',
        'id'
      )
    }
  }
}
