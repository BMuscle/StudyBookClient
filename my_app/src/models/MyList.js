import { Model } from '@vuex-orm/core'
import Category from './Category'
import MyListNote from './MyListNote'
import MyListNoteIndex from './MyListNoteIndex'

export default class MyList extends Model {
  static entity = 'my_lists'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.uid(),
      title: this.string(),
      category_id: this.number(),
      category: this.belongsTo(Category, 'category_id', 'online_id'),
      description: this.string(),
      notes: this.belongsToMany(
        MyListNote,
        MyListNoteIndex,
        'my_list_id',
        'my_list_note_id',
        'id',
        'id'
      )
    }
  }
}
