import { Model } from '@vuex-orm/core'
import path from 'path'
import Note from './Note'
import * as NoteCRUD from '../components/NoteCRUD'

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
  static getDirectory(parentDirectoryPath, directoryName) {
    const parentInode = NoteCRUD.getInode(parentDirectoryPath)
    return this.query()
      .where('directory_name', directoryName)
      .where('parent_inode', parentInode)
      .first()
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
  get descendantNotes() {
    let notes = []
    const directories = Directory.query()
      .with('notes')
      .where('path_from_root', path => path.indexOf(this.path_from_root) == 0)
      .get()
    for (const directory of directories) {
      notes = notes.concat(directory.notes.filter(note => note.is_exists))
    }
    return notes
  }
  async deleteWithChildren() {
    const directory = Directory.query()
      .with('child_directories')
      .with('notes')
      .find(this.inode)
    for (const directory of directory.child_directories) {
      await directory.deleteWithChildren()
    }
    for (const note of directory.notes) {
      note.is_exists = false
      note.$save()
    }
    this.$delete()
  }
}
