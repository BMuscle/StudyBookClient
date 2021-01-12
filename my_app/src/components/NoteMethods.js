import { notesJoin } from './NoteCRUD'
import { shell } from 'electron'
import { createNote } from './NoteCRUD.js'
import store from '../store'

export function OpenEditor(filePath, noteName) {
  const fullPath = notesJoin(filePath, noteName)
  shell.openPath(fullPath)
}

export async function Create(directoryPath) {
  const note = await createNote(directoryPath, '新しいノート.md')
  store.commit('notes/setFocusNote', note.inode)
  OpenEditor(note.parentDirectoryPath, note.fileName)
}
