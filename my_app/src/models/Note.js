import { Model } from '@vuex-orm/core'
import path from 'path'
import * as NoteCRUD from '../components/NoteCRUD'
import { readNoteHeader } from '../components/NoteCRUD'
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
      parent_inode: this.number().nullable(),
      parent_directory: this.belongsTo(Directory, 'parent_inode', 'inode'),
      file_name: this.string(),
      is_exists: this.boolean(),
      guid: this.string().nullable(),
      title: this.string(),
      category_id: this.number(),
      category: this.belongsTo(Category, 'category_id', 'online_id'),
      tags: this.belongsToMany(Tag, NoteTag, 'note_inode', 'tag_id', 'inode', 'id'),
      updated_at: this.attr(0)
    }
  }
  static getNote(parentDirectoryPath, fileName) {
    const parentInode = NoteCRUD.getInode(parentDirectoryPath)
    return this.query()
      .where('file_name', fileName)
      .where('parent_inode', parentInode)
      .first()
  }
  static queryExists() {
    return this.query().where('is_exists', true)
  }
  static deletedLocalNotes() {
    return this.query()
      .where('is_exists', false)
      .get()
  }
  static async updateAllNotes(data) {
    this.update({
      where: () => true,
      data: data
    })
  }
  get parent_directory_path_from_root() {
    const note = Note.query()
      .with('parent_directory')
      .find(this.inode)
    const pathFromRoot = note.parent_directory ? note.parent_directory.path_from_root : ''
    return pathFromRoot
  }
  get header() {
    return {
      title: this.title,
      category: this.category.name,
      tags: this.tags.map(tag => tag.name),
      get toString() {
        return `title: ${this.title}\ncategory: ${this.category}\ntags: ${this.tags.join(', ')}`
      }
    }
  }
  async updateHeadAndUpdatedAt(
    updatedAt = NoteCRUD.getMtimeMs(this.parent_directory_path_from_root, this.file_name)
  ) {
    if (updatedAt === this.updated_at) {
      return
    }
    const { title, category, tags } = await readNoteHeader(
      this.parent_directory_path_from_root,
      this.file_name
    )
    this.title = title
    this.category_id = Category.getCategory(category).online_id
    this.updated_at = updatedAt
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
  static beforeDelete(record) {
    record.deleteTags()
  }
}
