import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import sd from 'string_decoder'
import * as NoteCRUD from './NoteCRUD'
import Note from '../models/Note'
import Directory from '../models/Directory'

export async function onAppReady() {
  const children = await NoteCRUD.readNotesFolderRecursively()

  children
    .filter(child => child.isDirectory)
    .forEach(directory => {
      directory.directory_name = directory.name
      Directory.insert({ data: directory })
    })

  await Note.updateAllNotes({ is_exists: false })
  children
    .filter(child => !child.isDirectory)
    .forEach(note => {
      note.is_exists = true
      note.file_name = note.name
      Note.insertOrUpdate({ data: note })
    })
  deleteDoNotExistNotesFromDataBase()
  Note.all().forEach(note => note.updateHead())

  NoteCRUD.notesWatchHandler({
    onCreate(target) {
      console.log('Created:', target)
    },
    onChange(target) {
      console.log('Changed:', target)
    },
    onMove(target) {
      console.log('Moved:', target)
    },
    onRename(target) {
      console.log('Renamed:', target)
    },
    onMoveAndRename(target) {
      console.log('Moved and Renamed:', target)
    },
    onDelete(target) {
      console.log('Deleted:', target)
    }
  })
}

function deleteDoNotExistNotesFromDataBase() {
  Note.query()
    .where('is_exists', false)
    .get()
    .forEach(note => note.$delete())
}

async function onDeleteNote(path) {
  await Note.getNote(path)?.$delete()
}
