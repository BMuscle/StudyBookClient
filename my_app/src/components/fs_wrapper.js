import fs from "fs"
import path from "path"

function isDangerousPath(path) {
  return path.indexOf(":") !== -1 || path.indexOf("..") !== -1
}
export function createFile(parent_directory_path, file_name) {
  const create_file_path = path.join(parent_directory_path, file_name)
  if (isDangerousPath(create_file_path)) {
    throw new Error("アプリケーションのあるフォルダの外を操作する可能性があります");
  }
  if (!fs.existsSync(create_file_path)) {
    fs.writeFile(create_file_path, '', function (err) { console.log(err) })
  }
}
export function moveFile(parent_directory_path, file_name, destination_directory_path) {
  const old_path = path.join(parent_directory_path, file_name)
  const new_path = path.join(destination_directory_path, file_name)
  if (isDangerousPath(old_path) || isDangerousPath(new_path)) {
    throw new Error("アプリケーションのあるフォルダの外を操作する可能性があります");
  }
  if (!fs.existsSync(new_path)) {
    fs.rename(old_path, new_path, function (err) { console.log(err) })
  }
}
export function renameFile(parent_directory_path, file_name, new_file_name) {
  const old_path = path.join(parent_directory_path, file_name)
  const new_path = path.join(parent_directory_path, new_file_name)
  if (isDangerousPath(old_path) || isDangerousPath(new_path)) {
    throw new Error("アプリケーションのあるフォルダの外を操作する可能性があります");
  }
  if (!fs.existsSync(new_path)) {
    fs.rename(old_path, new_path, function (err) { console.log(err) })
  }
}
export function deleteFile(parent_directory_path, file_name) {
  const delete_file_path = path.join(parent_directory_path, file_name)
  if (isDangerousPath(delete_file_path)) {
    throw new Error("アプリケーションのあるフォルダの外を操作する可能性があります");
  }
  if (fs.existsSync(delete_file_path)) {
    fs.unlink(delete_file_path, function (err) { console.log(err) })
  }
}
export function createDirectory(parent_directory_path, directory_name) {
  const create_directory_path = path.join(parent_directory_path, directory_name)
  if (isDangerousPath(create_directory_path)) {
    throw new Error("アプリケーションのあるフォルダの外を操作する可能性があります");
  }
  if (!fs.existsSync(create_directory_path)) {
    fs.mkdir(create_directory_path, function (err) { console.log(err) })
  }
}
export function moveDirectory(parent_directory_path, directory_name, destination_directory_path) {
  const old_path = path.join(parent_directory_path, directory_name)
  const new_path = path.join(destination_directory_path, directory_name)
  if (isDangerousPath(old_path) || isDangerousPath(new_path)) {
    throw new Error("アプリケーションのあるフォルダの外を操作する可能性があります");
  }
  if (!fs.existsSync(new_path)) {
    fs.rename(old_path, new_path, function (err) { console.log(err) })
  }
}
export function renameDirectory(parent_directory_path, directory_name, new_directory_name) {
  const old_path = path.join(parent_directory_path, directory_name)
  const new_path = path.join(parent_directory_path, new_directory_name)
  if (isDangerousPath(old_path) || isDangerousPath(new_path)) {
    throw new Error("アプリケーションのあるフォルダの外を操作する可能性があります");
  }
  if (!fs.existsSync(new_path)) {
    fs.rename(old_path, new_path, function (err) { console.log(err) })
  }
}
export function deleteDirectory(parent_directory_path, directory_name) {
  const delete_directory_path = path.join(parent_directory_path, directory_name)
  if (isDangerousPath(delete_directory_path)) {
    throw new Error("アプリケーションのあるフォルダの外を操作する可能性があります");
  }
  if (fs.existsSync(delete_directory_path)) {
    fs.rmdir(delete_directory_path, { recursive: true }, function (err) { console.log(err) })
  }
}
