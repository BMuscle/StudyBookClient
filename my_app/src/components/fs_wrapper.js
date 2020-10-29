import fs from "fs"
import path from "path"

const DANGEROUS_PATH_ERROR_MESSAGE = "アプリケーションのあるフォルダの外を操作する可能性があります"
const ALREADY_PATH_IS_EXISTS_ERROR_MESSAGE = "同じ名前のファイル又はフォルダが既に存在する為、操作を完了できませんでした"
const NO_SUCH_PATH_ERROR = "ファイル又はフォルダが存在しない為、操作を完了できませんでした"

function isDangerousPath(path) {
  return path.indexOf(":") !== -1 || path.indexOf("..") !== -1
}
function ThrowAnErrorIfAnyPathIsDangerous(...paths) {
  for (const path of paths) {
    if (isDangerousPath(path)) { throw new Error(DANGEROUS_PATH_ERROR_MESSAGE + "(" + path + ")"); }
  }
}
function ThrowAnErrorIfThePathAlreadyExists(path) {
  if (fs.existsSync(path)) { throw new Error(ALREADY_PATH_IS_EXISTS_ERROR_MESSAGE + "(" + path + ")"); }
}
function ThrowAnErrorIfThePathDoesNotExist(path) {
  if (!fs.existsSync(path)) { throw new Error(NO_SUCH_PATH_ERROR + "(" + path + ")"); }
}
export function nameWithoutDuplicate(parentDirectoryPath, fileName) {
  const name = path.parse(fileName).name
  var serial = ""
  const ext = path.extname(fileName)
  if (name === "") { throw new Error("ファイル名が指定されていません") }
  if (fs.existsSync(path.join(parentDirectoryPath, name + ext))) {
    var number = 0
    do {
      serial = "(" + ++number + ")"
    } while (fs.existsSync(path.join(parentDirectoryPath, name + serial + ext)))
  }
  return name + serial + ext
}
export async function createFile(parentDirectoryPath, fileName) {
  const createFilePath = path.join(parentDirectoryPath, fileName)
  ThrowAnErrorIfAnyPathIsDangerous(createFilePath)
  ThrowAnErrorIfThePathAlreadyExists(createFilePath)
  fs.writeFileSync(createFilePath, '')
}
export async function overwriteFile(parentDirectoryPath, fileName, content) {
  const overwrittenFilePath = path.join(parentDirectoryPath, fileName)
  ThrowAnErrorIfAnyPathIsDangerous(overwrittenFilePath)
  ThrowAnErrorIfThePathDoesNotExist(overwrittenFilePath)
  fs.writeFileSync(overwrittenFilePath, content)
}
export async function moveFile(parentDirectoryPath, fileName, destinationDirectoryPath, newFileName) {
  const oldPath = path.join(parentDirectoryPath, fileName)
  const newPath = path.join(destinationDirectoryPath, newFileName)
  ThrowAnErrorIfAnyPathIsDangerous(oldPath, newPath)
  ThrowAnErrorIfThePathDoesNotExist(oldPath)
  ThrowAnErrorIfThePathAlreadyExists(newPath)
  fs.renameSync(oldPath, newPath)
}
export async function renameFile(parentDirectoryPath, fileName, newFileName) {
  const oldPath = path.join(parentDirectoryPath, fileName)
  const newPath = path.join(parentDirectoryPath, newFileName)
  ThrowAnErrorIfAnyPathIsDangerous(oldPath, newPath)
  ThrowAnErrorIfThePathDoesNotExist(oldPath)
  ThrowAnErrorIfThePathAlreadyExists(newPath)
  fs.renameSync(oldPath, newPath)
}
export async function deleteFile(parentDirectoryPath, fileName) {
  const deleteFilePath = path.join(parentDirectoryPath, fileName)
  ThrowAnErrorIfAnyPathIsDangerous(deleteFilePath)
  ThrowAnErrorIfThePathDoesNotExist(deleteFilePath)
  fs.unlinkSync(deleteFilePath)
}
export async function createDirectory(parentDirectoryPath, directoryName) {
  const createDirectoryPath = path.join(parentDirectoryPath, directoryName)
  ThrowAnErrorIfAnyPathIsDangerous(createDirectoryPath)
  ThrowAnErrorIfThePathAlreadyExists(createDirectoryPath)
  fs.mkdirSync(createDirectoryPath)
}
export async function moveDirectory(parentDirectoryPath, directoryName, destinationDirectoryPath) {
  const oldPath = path.join(parentDirectoryPath, directoryName)
  const newPath = path.join(destinationDirectoryPath, directoryName)
  ThrowAnErrorIfAnyPathIsDangerous(oldPath, newPath)
  ThrowAnErrorIfThePathDoesNotExist(oldPath)
  ThrowAnErrorIfThePathAlreadyExists(newPath)
  fs.renameSync(oldPath, newPath)
}
export async function renameDirectory(parentDirectoryPath, directoryName, newDirectoryName) {
  const oldPath = path.join(parentDirectoryPath, directoryName)
  const newPath = path.join(parentDirectoryPath, newDirectoryName)
  ThrowAnErrorIfAnyPathIsDangerous(oldPath, newPath)
  ThrowAnErrorIfThePathDoesNotExist(oldPath)
  ThrowAnErrorIfThePathAlreadyExists(newPath)
  fs.renameSync(oldPath, newPath)
}
export async function deleteDirectory(parentDirectoryPath, directoryName) {
  const deleteDirectoryPath = path.join(parentDirectoryPath, directoryName)
  ThrowAnErrorIfAnyPathIsDangerous(deleteDirectoryPath)
  ThrowAnErrorIfThePathDoesNotExist(deleteDirectoryPath)
  fs.rmdirSync(deleteDirectoryPath)
}
