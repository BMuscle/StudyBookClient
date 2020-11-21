import { Model } from '@vuex-orm/core'
import Note from './Note'

export default class Directory extends Model {
  static entity = 'directories'
  static primaryKey = 'inode'

  static fields() {
    return {
      inode: this.number(),
      parent_inode: this.number().nullable(),
      parent_directory: this.belongsTo(Directory, 'parent_inode'),
      child_directories: this.hasMany(Directory, 'parent_inode'),
      directory_name: this.string(),
      path_from_root: this.string(),
      notes: this.hasMany(Note, 'parent_inode')
    }
  }
}
