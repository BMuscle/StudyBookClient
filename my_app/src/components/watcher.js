import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import sd from 'string_decoder'
import * as NoteCRUD from './NoteCRUD'
import Note, { updateHead, getNote } from '../models/Note'
import NoteTag from '../models/NoteTag'
import NoteMylist from '../models/NoteMylist'
import DeletedLocalNote from '../models/DeletedLocalNote'
import Directory from '../models/Directory'

export async function onAppReady() {
  const children = await NoteCRUD.readNotesFolderRecursively()
  const directories = children.filter(child => child.isDirectory)
  const notes = children.filter(child => !child.isDirectory)
  for (const directory of directories) {
    Directory.insert({
      data: {
        inode: directory.inode,
        parent_inode: directory.parent_inode,
        directory_name: directory.name
      }
    })
  }
  Note.update({
    where: note => true,
    data: {
      is_exists: false
    }
  })
  for (const note of notes) {
    Note.insertOrUpdate({
      data: {
        inode: note.inode,
        parent_inode: note.parent_inode,
        file_name: note.name,
        is_exists: true,
        updated_at: note.updated_at
      }
    })
  }
  deleteDoNotExistNotesFromDataBase()
  for (const note of Note.query()
    .where('is_exists', true)
    .get()) {
    updateHead(note)
  }
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

function deleteNotefromDataBase(note) {
  NoteTag.delete(record => record.note_inode === note.inode)
  NoteMylist.delete(record => record.note_inode === note.inode)
  if (note.guid !== null) {
    DeletedLocalNote.insert({ data: { guid: note.guid } })
  }
  Note.delete(note.inode)
}
