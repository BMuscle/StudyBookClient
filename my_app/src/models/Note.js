import { Model } from '@vuex-orm/core'
import Directory from './Directory'
import Category from './Category'
import Tag from './Tag'
import NoteTag from './NoteTag'

export default class Note extends Model {
  static entity = 'notes'
  static primaryKey = 'inode'

  static fields() {
    return {
      inode: this.number(),
      parent_inode: this.number(),
      parent_directory: this.belongsTo(Directory, 'parent_inode'),
      file_name: this.string(),
      guid: this.string().nullable(),
      title: this.string(),
      category_id: this.number(),
      category: this.belongsTo(Category, 'category_id'),
      tags: this.belongsToMany(Tag, NoteTag, 'note_inode', 'tag_id'),
      updated_at: this.attr(new Date().getTime())
    }
  }
}
