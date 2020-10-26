import fs from "fs"
import path from "path"

const DANGEROUS_PATH_ERROR_MESSAGE = "アプリケーションのあるフォルダの外を操作する可能性があります"

function isDangerousPath(path) {
  return path.indexOf(":") !== -1 || path.indexOf("..") !== -1
}
export function createFile(parentDirectoryPath, fileName) {
  const createFilePath = path.join(parentDirectoryPath, fileName)
  if (isDangerousPath(createFilePath)) {
    throw new Error(DANGEROUS_PATH_ERROR_MESSAGE);
  }
  if (!fs.existsSync(createFilePath)) {
    fs.writeFile(createFilePath, '', function (err) { console.log(err) })
  }
}
export function moveFile(parentDirectoryPath, fileName, destinationDirectoryPath) {
  const oldPath = path.join(parentDirectoryPath, fileName)
  const newPath = path.join(destinationDirectoryPath, fileName)
  if (isDangerousPath(oldPath) || isDangerousPath(newPath)) {
    throw new Error(DANGEROUS_PATH_ERROR_MESSAGE);
  }
  if (!fs.existsSync(newPath)) {
    fs.rename(oldPath, newPath, function (err) { console.log(err) })
  }
}
export function renameFile(parentDirectoryPath, fileName, newFileName) {
  const oldPath = path.join(parentDirectoryPath, fileName)
  const newPath = path.join(parentDirectoryPath, newFileName)
  if (isDangerousPath(oldPath) || isDangerousPath(newPath)) {
    throw new Error(DANGEROUS_PATH_ERROR_MESSAGE);
  }
  if (!fs.existsSync(newPath)) {
    fs.rename(oldPath, newPath, function (err) { console.log(err) })
  }
}
export function deleteFile(parentDirectoryPath, fileName) {
  const deleteFilePath = path.join(parentDirectoryPath, fileName)
  if (isDangerousPath(deleteFilePath)) {
    throw new Error(DANGEROUS_PATH_ERROR_MESSAGE);
  }
  if (fs.existsSync(deleteFilePath)) {
    fs.unlink(deleteFilePath, function (err) { console.log(err) })
  }
}
export function createDirectory(parentDirectoryPath, directoryName) {
  const createDirectoryPath = path.join(parentDirectoryPath, directoryName)
  if (isDangerousPath(createDirectoryPath)) {
    throw new Error(DANGEROUS_PATH_ERROR_MESSAGE);
  }
  if (!fs.existsSync(createDirectoryPath)) {
    fs.mkdir(createDirectoryPath, function (err) { console.log(err) })
  }
}
export function moveDirectory(parentDirectoryPath, directoryName, destinationDirectoryPath) {
  const oldPath = path.join(parentDirectoryPath, directoryName)
  const newPath = path.join(destinationDirectoryPath, directoryName)
  if (isDangerousPath(oldPath) || isDangerousPath(newPath)) {
    throw new Error(DANGEROUS_PATH_ERROR_MESSAGE);
  }
  if (!fs.existsSync(newPath)) {
    fs.rename(oldPath, newPath, function (err) { console.log(err) })
  }
}
export function renameDirectory(parentDirectoryPath, directoryName, newDirectoryName) {
  const oldPath = path.join(parentDirectoryPath, directoryName)
  const newPath = path.join(parentDirectoryPath, newDirectoryName)
  if (isDangerousPath(oldPath) || isDangerousPath(newPath)) {
    throw new Error(DANGEROUS_PATH_ERROR_MESSAGE);
  }
  if (!fs.existsSync(newPath)) {
    fs.rename(oldPath, newPath, function (err) { console.log(err) })
  }
}
export function deleteDirectory(parentDirectoryPath, directoryName) {
  const deleteDirectoryPath = path.join(parentDirectoryPath, directoryName)
  if (isDangerousPath(deleteDirectoryPath)) {
    throw new Error(DANGEROUS_PATH_ERROR_MESSAGE);
  }
  if (fs.existsSync(deleteDirectoryPath)) {
    fs.rmdir(deleteDirectoryPath, { recursive: true }, function (err) { console.log(err) })
  }
}
