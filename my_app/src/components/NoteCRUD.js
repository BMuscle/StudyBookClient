import * as fs_wrapper from "./fs_wrapper"
//const fs_wrapper = require("./fs_wrapper")
const path = require("path")

function notesJoin(parentDirectoryPath) {
  return path.join("notes", parentDirectoryPath)
}
export async function createNote(parentDirectoryPath, fileName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const fileNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(notesJoinedParentPath, fileName)
  await fs_wrapper.createFile(notesJoinedParentPath, fileNameWithoutDuplicate)
}
export async function moveNote(parentDirectoryPath, fileName, destinationDirectoryPath) {
  const notesJoinedPath = notesJoin(parentDirectoryPath)
  const nameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(notesJoinedPath, fileName)
  await fs_wrapper.moveFile(notesJoinedPath, nameWithoutDuplicate)
}
export async function renameNote(parentDirectoryPath, fileName, newFileName) {
  throw new Error("未実装");
}
export async function deleteNote(parentDirectoryPath, fileName) {
  throw new Error("未実装");
}
