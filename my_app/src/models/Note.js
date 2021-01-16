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
  static async hydrateUpdatedHeader(record) {
    const note = Note.find(record.inode)
    const directoryPath = Directory.find(record.parent_inode)?.path_from_root ?? ''
    record.updated_at ??= await NoteCRUD.getMtimeMs(directoryPath, record.file_name)
    if (record.updated_at === note?.updated_at) {
      return { record: record }
    }
    const { title, category, tags } = await readNoteHeader(directoryPath, record.file_name)
    record.title = title
    record.category_id = Category.getCategory(category).online_id
    return { record: record, note: note, tags: tags }
  }
  static async updateTags(data) {
    await Promise.all(
      data.map(({ record, note }) => note?.deleteTags() ?? Note.find(record.inode)?.deleteTags())
    )
    const noteTags = []
    for (const { record, tags } of data) {
      for (const tag of tags) {
        const tagId = await Tag.insertTag(tag)
        noteTags.push({ note_inode: record.inode, tag_id: tagId })
      }
    }
    NoteTag.insert({ data: noteTags })
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
}
