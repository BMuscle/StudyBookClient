import * as fs_wrapper from "./fs_wrapper"
import path from "path"

function notesJoin(parentDirectoryPath) {
  return path.join("notes", parentDirectoryPath)
}
export async function createNote(parentDirectoryPath, fileName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const fileNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(notesJoinedParentPath, fileName)
  await fs_wrapper.createFile(notesJoinedParentPath, fileNameWithoutDuplicate)
}
export async function moveNote(parentDirectoryPath, fileName, destinationDirectoryPath) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const notesJoinedDestinationPath = notesJoin(destinationDirectoryPath)
  const fileNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(notesJoinedDestinationPath, fileName)
  await fs_wrapper.moveFile(notesJoinedParentPath, fileName, notesJoinedDestinationPath, fileNameWithoutDuplicate)
}
export async function renameNote(parentDirectoryPath, fileName, newFileName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const newFileNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(notesJoinedParentPath, newFileName)
  await fs_wrapper.moveFile(notesJoinedParentPath, fileName, newFileNameWithoutDuplicate)
}
export async function deleteNote(parentDirectoryPath, fileName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  await fs_wrapper.createFile(notesJoinedParentPath, fileName)
}
