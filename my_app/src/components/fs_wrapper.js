import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import sd from 'string_decoder'

const DANGEROUS_PATH_ERROR_MESSAGE =
  'アプリケーションのあるフォルダの外を操作する可能性があります'
const ALREADY_PATH_IS_EXISTS_ERROR_MESSAGE =
  '同じ名前のファイル又はフォルダが既に存在する為、操作を完了できませんでした'
const NO_SUCH_PATH_ERROR =
  'ファイル又はフォルダが存在しない為、操作を完了できませんでした'

function isDangerousPath(path) {
  return path.indexOf(':') !== -1 || path.indexOf('..') !== -1
}
function ThrowAnErrorIfAnyPathIsDangerous(...paths) {
  for (const path of paths) {
    if (isDangerousPath(path)) {
      throw new Error(DANGEROUS_PATH_ERROR_MESSAGE + '(' + path + ')')
    }
  }
}
function ThrowAnErrorIfThePathAlreadyExists(path) {
  if (fs.existsSync(path)) {
    throw new Error(ALREADY_PATH_IS_EXISTS_ERROR_MESSAGE + '(' + path + ')')
  }
}
function ThrowAnErrorIfThePathDoesNotExist(path) {
  if (!fs.existsSync(path)) {
    throw new Error(NO_SUCH_PATH_ERROR + '(' + path + ')')
  }
}
export function nameWithoutDuplicate(parentDirectoryPath, fileName) {
  const name = path.parse(fileName).name
  var serial = ''
  const ext = path.extname(fileName)
  if (name === '') {
    throw new Error('ファイル名が指定されていません')
  }
  if (fs.existsSync(path.join(parentDirectoryPath, name + ext))) {
    var number = 0
    do {
      serial = '(' + ++number + ')'
    } while (fs.existsSync(path.join(parentDirectoryPath, name + serial + ext)))
  }
  return name + serial + ext
}
export function getInode(path) {
  ThrowAnErrorIfAnyPathIsDangerous(path)
  ThrowAnErrorIfThePathDoesNotExist(path)
  return fs.statSync(path).ino
}
export async function createFile(parentDirectoryPath, fileName) {
  const createFilePath = path.join(parentDirectoryPath, fileName)
  ThrowAnErrorIfAnyPathIsDangerous(createFilePath)
  ThrowAnErrorIfThePathAlreadyExists(createFilePath)
  fs.writeFileSync(createFilePath, '')
}
export async function readFile(parentDirectoryPath, fileName) {
  const readFilePath = path.join(parentDirectoryPath, fileName)
  ThrowAnErrorIfAnyPathIsDangerous(readFilePath)
  ThrowAnErrorIfThePathDoesNotExist(readFilePath)
  return fs.readFileSync(readFilePath, 'utf8')
}
export async function overwriteFile(parentDirectoryPath, fileName, content) {
  const overwrittenFilePath = path.join(parentDirectoryPath, fileName)
  ThrowAnErrorIfAnyPathIsDangerous(overwrittenFilePath)
  ThrowAnErrorIfThePathDoesNotExist(overwrittenFilePath)
  fs.writeFileSync(overwrittenFilePath, content)
}
export async function moveFile(
  parentDirectoryPath,
  fileName,
  destinationDirectoryPath,
  newFileName
) {
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
export async function readDirectory(parentDirectoryPath, directoryName) {
  const readDirectoryPath = path.join(parentDirectoryPath, directoryName)
  ThrowAnErrorIfAnyPathIsDangerous(readDirectoryPath)
  ThrowAnErrorIfThePathDoesNotExist(readDirectoryPath)
  return fs.readdirSync(readDirectoryPath)
}
export async function readdirRecursively(directoryPath, inode = null) {
  ThrowAnErrorIfAnyPathIsDangerous(directoryPath)
  const children = fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .map(dirent => {
      const status = fs.statSync(path.join(directoryPath, dirent.name))
      return {
        isDirectory: dirent.isDirectory(),
        inode: status.ino,
        parent_inode: inode,
        name: dirent.name,
        updated_at: status.mtimeMs
      }
    })
  var add_children = []
  for (const child of children)
    if (child.isDirectory)
      add_children = add_children.concat(
        await readdirRecursively(
          path.join(directoryPath, child.name),
          child.inode
        )
      )
  return children.concat(add_children)
}
export async function moveDirectory(
  parentDirectoryPath,
  directoryName,
  destinationDirectoryPath
) {
  const oldPath = path.join(parentDirectoryPath, directoryName)
  const newPath = path.join(destinationDirectoryPath, directoryName)
  ThrowAnErrorIfAnyPathIsDangerous(oldPath, newPath)
  ThrowAnErrorIfThePathDoesNotExist(oldPath)
  ThrowAnErrorIfThePathAlreadyExists(newPath)
  fs.renameSync(oldPath, newPath)
}
export async function renameDirectory(
  parentDirectoryPath,
  directoryName,
  newDirectoryName
) {
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
  fs.rmdirSync(deleteDirectoryPath, { recursive: true })
}
export async function watchHandler(directoryPath, callback) {
  const handle = spawn('.\\src\\components\\CodeHelper.exe', [directoryPath])
  const stringDecoder = new sd.StringDecoder('utf8')

  handle.stdout.on('data', data => {
    const decodedData = stringDecoder.write(data)
    const events = decodedData
      .split(/\r\n|\n/)
      .slice(0, -1)
      .map(event => {
        return {
          type: event.substr(0, 1),
          path: event.substr(2)
        }
      })
    callback(events)
  })
  return handle
}
