import { Database } from '@vuex-orm/core'
import Note from '@/models/Note'
import Category from '@/models/Category'
import Mylist from '@/models/Mylist'
import NoteMylist from '@/models/NoteMylist'

const database = new Database()

database.register(Note)
database.register(Category)
database.register(Mylist)
database.register(NoteMylist)

export default database
