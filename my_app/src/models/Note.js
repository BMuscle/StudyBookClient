import { Model } from '@vuex-orm/core'
import path from 'path'
import * as NoteCRUD from '../components/NoteCRUD'
import { readNoteHeader } from '../components/NoteCRUD'
import NoteHeader from '../components/NoteHeader'
import Directory from './Directory'
import Category from './Category'
import Tag from './Tag'
import NoteTag from './NoteTag'
import store from '../store'
import util from '../util/util'

function* defaultCategoryId() {
  yield store.state.category_module.default
}

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
      title: this.string(''),
      category_id: this.number(defaultCategoryId()),
      category: this.belongsTo(Category, 'category_id', 'online_id'),
      tags: this.belongsToMany(Tag, NoteTag, 'note_inode', 'tag_id', 'inode', 'id'),
      updated_at: this.attr(0)
    }
  }
  static getNote(parentDirectoryPath, fileName) {
    const parentInode = NoteCRUD.getInode(parentDirectoryPath)
    return this.queryExists()
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
  get parent_directory_path() {
    let note = this
    if (note.parent_inode != null && note.parent_directory == null) {
      // util.trace('parent_directory プロパティが無い為、低速です')
      note = Note.query()
        .with('parent_directory')
        .find(this.inode)
    }
    return note?.parent_directory?.path_from_root ?? ''
  }
  get header() {
    return new NoteHeader(
      this.title,
      this.category.name,
      this.tags.map(tag => tag.name)
    )
  }
  async updateHeadAndUpdatedAt(
    updatedAt = null
  ) {
    if(updatedAt == null) {
      updatedAt = await NoteCRUD.getMtimeMs(this.parent_directory_path, this.file_name)
    }
    if (updatedAt === this.updated_at) {
      return
    }
    const { title, category, tags } = await readNoteHeader(
      this.parent_directory_path,
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
