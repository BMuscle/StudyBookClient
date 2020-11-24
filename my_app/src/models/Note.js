import { Model } from '@vuex-orm/core'
import path from 'path'
import * as NoteCRUD from '../components/NoteCRUD'
import { readNoteHeader } from '../components/NoteCRUD'
import Directory from './Directory'
import Category, { getCategory } from './Category'
import Tag, { insertTag } from './Tag'
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
      is_exists: this.boolean(),
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

//指定されたノートのヘッダー情報を更新する。
export async function updateHead(note) {
  const header = await readNoteHeader(
    note.parent_directory_path_from_root,
    note.file_name
  )
  Note.update({
    where: note.inode,
    data: {
      title: header.title,
      category_id: getCategory(header.category).online_id
    }
  })
  NoteTag.delete(record => record.note_inode === note.inode)
  const tags = await Promise.all(header.tags.map(tagName => insertTag(tagName)))
  for (const tag of tags) {
    NoteTag.insert({
      data: {
        tag_id: tag,
        note_inode: note.inode
      }
    })
  }
}

//削除されたノートのレコードをパスから検索する。
export async function getNote(filePath) {
  const fileName = path.basename(filePath)
  const parentDirectoryPath = path.dirname(filePath)
  const parentInode = NoteCRUD.getInode(parentDirectoryPath)
  return Note.query()
    .where('file_name', fileName)
    .where('parent_inode', parentInode)
    .first()
}
