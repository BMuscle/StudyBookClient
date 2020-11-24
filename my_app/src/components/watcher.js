import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import sd from 'string_decoder'
import * as NoteCRUD from './NoteCRUD'
import Note, {
  updateHead,
  getNote,
  updateAllNotes,
  deleteNotefromDataBase
} from '../models/Note'
import Directory from '../models/Directory'

export async function onAppReady() {
  const children = await NoteCRUD.readNotesFolderRecursively()

  children
    .filter(child => child.isDirectory)
    .forEach(directory => Directory.insert({ data: directory }))

  await updateAllNotes({ is_exists: false })
  children
    .filter(child => !child.isDirectory)
    .forEach(note => {
      note.is_exists = true
      Note.insertOrUpdate({ data: note })
    })
  deleteDoNotExistNotesFromDataBase()
  Note.all().forEach(note => updateHead(note))
}

function deleteDoNotExistNotesFromDataBase() {
  Note.query()
    .where('is_exists', false)
    .get()
    .forEach(note => deleteNotefromDataBase(note))
}

async function onDeleteNote(path) {
  const note = await getNote(path)
  if (note !== null) {
    deleteNotefromDataBase(note)
  }
}
