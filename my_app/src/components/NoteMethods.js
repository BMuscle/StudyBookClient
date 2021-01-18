import { notesJoin } from './NoteCRUD'
import { shell } from 'electron'
import { createNote } from './NoteCRUD.js'
import store from '../store'
import Directory from '../models/Directory'

export function openEditor(directoryPath, fileName) {
  const fullPath = notesJoin(directoryPath, fileName)
  shell.openPath(fullPath)
}

export async function create() {
  const selectedDir = Directory.find(store.state.notes.focusDirectory)
  const directoryPath = selectedDir?.path_from_root ?? ''
  const createdNote = await createNote(directoryPath, '新しいノート.md')
  store.commit('notes/setFocusNote', createdNote.inode)
  openEditor(createdNote.parentDirectoryPath, createdNote.fileName)
}
