import { Model } from '@vuex-orm/core'
import path from 'path'
import * as NoteCRUD from '../components/NoteCRUD'
import { readNoteHeader } from '../components/NoteCRUD'
import Directory from './Directory'
import Category from './Category'
import Tag from './Tag'
import NoteTag from './NoteTag'
import DeletedLocalNote from './DeletedLocalNote'

export default class Note extends Model {
  static entity = 'notes'
  static primaryKey = 'inode'

  static fields() {
    return {
      inode: this.number(),
      parent_inode: this.number().nullable(),
      parent_directory: this.belongsTo(Directory, 'parent_inode', 'inode'),
      file_name: this.string(),
      is_exists: this.boolean(),
      guid: this.string().nullable(),
      title: this.string(),
      category_id: this.number(),
      category: this.belongsTo(Category, 'category_id', 'online_id'),
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
  static async getNote(filePath) {
    const fileName = path.basename(filePath)
    const parentDirectoryPath = path.dirname(filePath)
    const parentInode = NoteCRUD.getInode(parentDirectoryPath)
    return this.query()
      .where('file_name', fileName)
      .where('parent_inode', parentInode)
      .first()
  }
  static async updateAllNotes(data) {
    this.update({
      where: note => true,
      data: data
    })
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
  async updateHead() {
    const { title, category, tags } = await readNoteHeader(
      this.parent_directory_path_from_root,
      this.file_name
    )
    this.title = title
    this.category_id = Category.getCategory(category).online_id
    this.$save()
    await this.updateTags(tags)
  }
  async updateTags(tags) {
    await this.deleteTags()
    await this.insertTags(tags)
  }
  async insertTags(tags) {
    await Promise.all(tags.map(tagName => this.insertTag(tagName)))
  }
  async insertTag(tagName) {
    const tagId = await Tag.insertTag(tagName)
    await NoteTag.insert({
      data: {
        tag_id: tagId,
        note_inode: this.inode
      }
    })
  }
  deleteTags() {
    NoteTag.delete(record => record.note_inode === this.inode)
  }
  insertDeletedLocalNote() {
    if (this.guid != null) {
      DeletedLocalNote.insert({ data: { guid: this.guid } })
    }
  }
  deleteFromDataBase() {
    this.deleteTags()
    this.insertDeletedLocalNote()
    this.$delete()
  }
}
