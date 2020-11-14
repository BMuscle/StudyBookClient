import { Model } from '@vuex-orm/core'
import Category from '@/models/Category'
import Tag from '@/models/Tag'
import NoteTag from '@/models/NoteTag'

export default class Note extends Model {
  static entity = 'notes'
  static primaryKey = ['id']

  static fields() {
    return {
      id: this.uid(),
      online_id: this.string().nullable(),
      title: this.string(),
      category_id: this.attr(),
      category: this.belongsTo(Category, 'category_id'),
      tags: this.belongsToMany(Tag, NoteTag, 'note_id', 'tag_id')
    }
  }
}
