import { Model } from '@vuex-orm/core'
import Note from './Note'
import NoteTag from './NoteTag'
import MyListNote from './MyListNote'
import MyListNoteTag from './MyListNoteTag'

export default class Tag extends Model {
  static entity = 'tags'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.uid(),
      online_id: this.number().nullable(),
      name: this.string(),
      notes: this.belongsToMany(Note, NoteTag, 'tag_id', 'note_inode', 'id', 'inode'),
      my_list_notes: this.belongsToMany(MyListNote, MyListNoteTag, 'tag_id', 'my_list_note_id')
    }
  }
  static async insertTag(name) {
    const tag = this.query()
      .where('name', name)
      .first()
    if (tag !== null) {
      return tag.id
    }
    const entities = await this.insert({ data: { name: name } })
    return entities.tags[0].id
  }
  static thatHaveNotes() {
    return this.query()
      .with('notes')
      .with('my_list_notes')
      .orderBy('name', 'asc')
      .get()
      .filter(record => record.notes.length != 0 || record.my_list_notes.length != 0)
  }
}
