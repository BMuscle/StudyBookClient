import { Database } from '@vuex-orm/core'
import Note from '@/models/Note'
import Mylist from '@/models/Mylist'
import NoteMylist from '@/models/NoteMylist'
import Category from '@/models/Category'
import Tag from '@/models/Tag'
import NoteTag from '@/models/NoteTag'

const database = new Database()

database.register(Note)
database.register(Mylist)
database.register(NoteMylist)
database.register(Category)
database.register(Tag)
database.register(NoteTag)

export default database
