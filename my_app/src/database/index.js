import { Database } from '@vuex-orm/core'
import Note from '../models/Note'
import Directory from '../models/Directory'
import MyList from '../models/MyList'
import MyListNoteIndex from '../models/MyListNoteIndex'
import MyListNote from '../models/MyListNote'
import MyListNoteTag from '../models/MyListNoteTag'
import Category from '../models/Category'
import Tag from '../models/Tag'
import NoteTag from '../models/NoteTag'
import DeletedLocalNote from '../models/DeletedLocalNote'
import User from '../models/User'
import UpdatedAt from '../models/UpdatedAt'

const database = new Database()

database.register(Note)
database.register(Directory)
database.register(MyList)
database.register(MyListNote)
database.register(MyListNoteTag)
database.register(MyListNoteIndex)
database.register(Category)
database.register(Tag)
database.register(NoteTag)
database.register(DeletedLocalNote)
database.register(User)
database.register(UpdatedAt)

export default database
