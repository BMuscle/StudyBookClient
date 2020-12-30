import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import sd from 'string_decoder'
import asyncLock from 'async-lock'

const ALREADY_PATH_IS_EXISTS_ERROR_MESSAGE =
  '同じ名前のファイル又はフォルダが既に存在する為、操作を完了できませんでした'
const NO_SUCH_PATH_ERROR = 'ファイル又はフォルダが存在しない為、操作を完了できませんでした'

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
  ThrowAnErrorIfThePathDoesNotExist(path)
  return fs.statSync(path).ino
}
export function getMtimeMs(parentDirectoryPath, fileName) {
  const filePath = path.join(parentDirectoryPath, fileName)
  ThrowAnErrorIfThePathDoesNotExist(filePath)
  return fs.statSync(filePath).mtimeMs
}

export async function createFile(parentDirectoryPath, fileName) {
  const createFilePath = path.join(parentDirectoryPath, fileName)
  ThrowAnErrorIfThePathAlreadyExists(createFilePath)
  fs.writeFileSync(createFilePath, '')
}
export async function readFile(parentDirectoryPath, fileName) {
  const readFilePath = path.join(parentDirectoryPath, fileName)
  ThrowAnErrorIfThePathDoesNotExist(readFilePath)
  return fs.readFileSync(readFilePath, 'utf8')
}
export async function overwriteFile(parentDirectoryPath, fileName, content) {
  const overwrittenFilePath = path.join(parentDirectoryPath, fileName)
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
  ThrowAnErrorIfThePathDoesNotExist(oldPath)
  ThrowAnErrorIfThePathAlreadyExists(newPath)
  fs.renameSync(oldPath, newPath)
}
export async function renameFile(parentDirectoryPath, fileName, newFileName) {
  const oldPath = path.join(parentDirectoryPath, fileName)
  const newPath = path.join(parentDirectoryPath, newFileName)
  ThrowAnErrorIfThePathDoesNotExist(oldPath)
  ThrowAnErrorIfThePathAlreadyExists(newPath)
  fs.renameSync(oldPath, newPath)
}
export async function deleteFile(parentDirectoryPath, fileName) {
  const deleteFilePath = path.join(parentDirectoryPath, fileName)
  ThrowAnErrorIfThePathDoesNotExist(deleteFilePath)
  fs.unlinkSync(deleteFilePath)
}
export async function createDirectory(parentDirectoryPath, directoryName) {
  const createDirectoryPath = path.join(parentDirectoryPath, directoryName)
  ThrowAnErrorIfThePathAlreadyExists(createDirectoryPath)
  fs.mkdirSync(createDirectoryPath)
}
export async function readDirectory(parentDirectoryPath, directoryName) {
  const readDirectoryPath = path.join(parentDirectoryPath, directoryName)
  ThrowAnErrorIfThePathDoesNotExist(readDirectoryPath)
  return fs.readdirSync(readDirectoryPath)
}
export async function readdirRecursively(directoryPath, inode = null) {
  const children = fs.readdirSync(directoryPath, { withFileTypes: true }).map(dirent => {
    const status = fs.statSync(path.join(directoryPath, dirent.name))
    return {
      isDirectory: dirent.isDirectory(),
      inode: status.ino,
      parent_inode: inode,
      name: dirent.name
    }
  })
  var add_children = []
  for (const child of children)
    if (child.isDirectory)
      add_children = add_children.concat(
        await readdirRecursively(path.join(directoryPath, child.name), child.inode)
      )
  return children.concat(add_children)
}
export async function moveDirectory(parentDirectoryPath, directoryName, destinationDirectoryPath) {
  const oldPath = path.join(parentDirectoryPath, directoryName)
  const newPath = path.join(destinationDirectoryPath, directoryName)
  ThrowAnErrorIfThePathDoesNotExist(oldPath)
  ThrowAnErrorIfThePathAlreadyExists(newPath)
  fs.renameSync(oldPath, newPath)
}
export async function renameDirectory(parentDirectoryPath, directoryName, newDirectoryName) {
  const oldPath = path.join(parentDirectoryPath, directoryName)
  const newPath = path.join(parentDirectoryPath, newDirectoryName)
  ThrowAnErrorIfThePathDoesNotExist(oldPath)
  ThrowAnErrorIfThePathAlreadyExists(newPath)
  fs.renameSync(oldPath, newPath)
}
export async function deleteDirectory(parentDirectoryPath, directoryName) {
  const deleteDirectoryPath = path.join(parentDirectoryPath, directoryName)
  ThrowAnErrorIfThePathDoesNotExist(deleteDirectoryPath)
  fs.rmdirSync(deleteDirectoryPath, { recursive: true })
}
export class WatchHandler {
  static stringDecoder = new sd.StringDecoder('utf8')
  static handle = null
  static callbackObject = null
  static lock = new asyncLock()
  static start(directoryPath, callbackObject) {
    /*global __static*/
    try {
      fs.copyFileSync(
        __static + '/CodeHelper.exe',
        __static + '/../CodeHelper.exe',
        fs.constants.COPYFILE_EXCL
      )
    } catch {
      // エラー無視
    }
    WatchHandler.handle = spawn(__static + '/../CodeHelper.exe', [directoryPath])
    WatchHandler.handle.stdout.on('data', WatchHandler.onStdOut)
    WatchHandler.callbackObject = callbackObject
  }
  static kill() {
    WatchHandler.handle.kill()
  }
  static lockRun(func, target) {
    WatchHandler.lock.acquire('WatchHandler', async () => {
      await func(target)
    })
  }
  static onStdOut(data) {
    const decodedData = WatchHandler.stringDecoder.write(data)
    const events = decodedData.split(/\r\n|\n/).slice(0, -1)
    for (const event of events) {
      const type = event.substr(0, 1)
      const targetPath = event.substr(2)
      const target = {
        parentDirectoryPath: path.dirname(targetPath),
        name: path.basename(targetPath)
      }
      switch (type) {
        case '0':
          target.stat = fs.statSync(targetPath)
          if (target.stat.isFile()) {
            WatchHandler.lockRun(WatchHandler.callbackObject.onChangeNote, target)
          }
          break
        case '1':
          target.stat = fs.statSync(targetPath)
          if (target.stat.isFile()) {
            WatchHandler.lockRun(WatchHandler.callbackObject.onCreateNote, target)
          } else {
            WatchHandler.lockRun(WatchHandler.callbackObject.onCreateDirectory, target)
          }
          break
        case '2':
          WatchHandler.lockRun(WatchHandler.callbackObject.onDelete, target)
          break
      }
    }
  }
}
