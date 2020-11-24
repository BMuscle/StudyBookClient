import { Model } from '@vuex-orm/core'
import Directory from './Directory'
import Category from './Category'
import Tag from './Tag'
import NoteTag from './NoteTag'
import Mylist from './Mylist'
import NoteMylist from './NoteMylist'

export default class Note extends Model {
  static entity = 'notes'
  static primaryKey = 'inode'

  static fields() {
    return {
      inode: this.number(),
      parent_inode: this.number().nullable(),
      parent_directory: this.belongsTo(Directory, 'parent_inode', 'inode'),
      file_name: this.string(),
      guid: this.string().nullable(),
      title: this.string(),
      category_id: this.number(),
      category: this.belongsTo(Category, 'category_id', 'online_id'),
      mylists: this.belongsToMany(
        Mylist,
        NoteMylist,
        'note_inode',
        'mylist_id',
        'inode',
        'id'
      ),
      tags: this.belongsToMany(
        Tag,
        NoteTag,
        'note_inode',
        'tag_id',
        'inode',
        'id'
      ),
      updated_at: this.attr(new Date().getTime())
    }
  }
  get parent_directory_path_from_root() {
    const note = Note.query()
      .with('parent_directory')
      .find(this.inode)
    const pathFromRoot = note.parent_directory
      ? note.parent_directory.path_from_root
      : ''
    return pathFromRoot
  }
}
