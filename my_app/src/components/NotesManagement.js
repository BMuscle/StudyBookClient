

function notesJoin(file_path) {
  return path.join("notes", file_path)
}
export function createNote(file_path) {
  createFile(notesJoin(file_path))
}
export function moveNote(file_path, destination_directory) {
  throw new Error("未実装");
}
export function renameNote(file_path, new_filename) {
  throw new Error("未実装");
}
export function deleteNote(file_path) {
  throw new Error("未実装");
}
