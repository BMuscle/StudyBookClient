import { Model } from '@vuex-orm/core'
import Note from './Note'
import NoteTag from './NoteTag'

export default class Tag extends Model {
  static entity = 'tags'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.uid(),
      online_id: this.number().nullable(),
      name: this.string(),
      notes: this.belongsToMany(
        Note,
        NoteTag,
        'tag_id',
        'note_inode',
        'id',
        'inode'
      )
    }
  }
}

export async function insertTag(name) {
  const tag = Tag.query()
    .where('name', name)
    .first()
  if (tag !== null) {
    return tag.id
  }
  const entities = await Tag.insert({
    data: {
      name: name
    }
  })
  return entities.tags[0].id
}
