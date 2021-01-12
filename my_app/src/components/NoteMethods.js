import { notesJoin } from './NoteCRUD'
import { shell } from 'electron'

export function OpenEditor(filePath, noteName) {
  const fullPath = notesJoin(filePath, noteName)
  shell.openPath(fullPath)
}
