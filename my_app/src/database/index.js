import { Database } from '@vuex-orm/core'
import Note from '@/models/Note'
import Category from '@/models/Category'
import Mylist from '@/models/Mylist'
import Mylistable from '@/models/Mylistable'

const database = new Database()

database.register(Note)
database.register(Category)
database.register(Mylist)
database.register(Mylistable)

export default database
