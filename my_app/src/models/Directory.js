import { Model } from '@vuex-orm/core'
import path from 'path'
import Note from './Note'

export default class Directory extends Model {
  static entity = 'directories'
  static primaryKey = 'inode'

  static fields() {
    return {
      inode: this.number(),
      parent_inode: this.number().nullable(),
      parent_directory: this.belongsTo(Directory, 'parent_inode', 'inode'),
      child_directories: this.hasMany(Directory, 'parent_inode', 'inode'),
      directory_name: this.string(),
      notes: this.hasMany(Note, 'parent_inode', 'inode')
    }
  }
  get path_from_root() {
    if (this.parent_inode === null) {
      return this.directory_name
    } else {
      const parentDirectory = Directory.query()
        .with('parent_directory')
        .find(this.parent_inode)
      return path.join(parentDirectory.path_from_root, this.directory_name)
    }
  }
}
