import * as fs_wrapper from './fs_wrapper'
import path from 'path'
import mkdirp from 'mkdirp'
import store from '../store'
import NoteHeader from './NoteHeader'

function isDangerousPath(aPath) {
  return aPath.indexOf(':') !== -1 || aPath.indexOf('..') !== -1
}
function ThrowAnErrorIfAnyPathIsDangerous(...paths) {
  for (const aPath of paths) {
    if (isDangerousPath(aPath)) {
      throw new Error(
        'ノートを保存しているフォルダの外を操作する可能性があります' + '(' + aPath + ')'
      )
    }
  }
}

export function initNoteDirectory() {
  mkdirp(store.state.root.rootPath)
}

export function notesJoin(...paths) {
  return path.join(store.state.root.rootPath, ...paths)
}
function notesRemove(fullPath) {
  return path.relative(store.state.root.rootPath, fullPath)
}
export function getInode(aPath) {
  if (aPath === '') {
    return null
  }
  ThrowAnErrorIfAnyPathIsDangerous(aPath)
  const notesJoinedPath = notesJoin(aPath)
  return fs_wrapper.getInode(notesJoinedPath)
}
export async function getMtimeMs(parentDirectoryPath, fileName) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, fileName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  return await fs_wrapper.getMtimeMs(notesJoinedParentPath, fileName)
}
export async function createNote(parentDirectoryPath, fileName) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, fileName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const fileNameWithoutDuplicate = await fs_wrapper.nameWithoutDuplicate(notesJoinedParentPath, fileName)
  const content = new NoteHeader() + '\n\n'
  await fs_wrapper.writeFile(notesJoinedParentPath, fileNameWithoutDuplicate, content)
  return {
    inode: fs_wrapper.getInode(path.join(notesJoinedParentPath, fileNameWithoutDuplicate)),
    parentDirectoryPath: parentDirectoryPath,
    fileName: fileNameWithoutDuplicate
  }
}
export async function readNote(parentDirectoryPath, fileName) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, fileName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  return await fs_wrapper.readFile(notesJoinedParentPath, fileName)
}
export async function readNoteHeader(parentDirectoryPath, fileName) {
  const note = await readNote(parentDirectoryPath, fileName)
  const rows = note.split(/\r\n|\n/)
  const header = new NoteHeader()

  try {
    for (const row of rows) {
      if (row === '') {
        break
      }
      const columns = row.split(/:/)
      const dataCategory = columns[0].trim()
      const data = columns[1].trim()

      switch (dataCategory) {
        case 'title':
          header.title = data
          break
        case 'category':
          header.category = data
          break
        case 'tags':
          header.tags = data
            .split(/,/)
            .map(tag => tag.trim())
            .filter(tag => tag != '')
          break
      }
    }
  } catch (error) {
    console.log('ヘッダーを読み取れませんでした', parentDirectoryPath, fileName)
  }
  if (header.title == '') {
    header.title = '無題のノート'
  }
  return header
}
export async function overwriteNote(parentDirectoryPath, fileName, content) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, fileName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  await fs_wrapper.writeFile(notesJoinedParentPath, fileName, content)
}
export async function moveNote(parentDirectoryPath, fileName, destinationDirectoryPath) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, fileName, destinationDirectoryPath)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const notesJoinedDestinationPath = notesJoin(destinationDirectoryPath)
  const fileNameWithoutDuplicate = await fs_wrapper.nameWithoutDuplicate(
    notesJoinedDestinationPath,
    fileName
  )
  await fs_wrapper.moveFile(
    notesJoinedParentPath,
    fileName,
    notesJoinedDestinationPath,
    fileNameWithoutDuplicate
  )
}
export async function renameNote(parentDirectoryPath, fileName, newFileName) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, fileName, newFileName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const newFileNameWithoutDuplicate = await fs_wrapper.nameWithoutDuplicate(
    notesJoinedParentPath,
    newFileName
  )
  await fs_wrapper.renameFile(notesJoinedParentPath, fileName, newFileNameWithoutDuplicate)
}
export async function deleteNote(parentDirectoryPath, fileName) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, fileName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  await fs_wrapper.deleteFile(notesJoinedParentPath, fileName)
}
export async function createDirectory(parentDirectoryPath, directoryName) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, directoryName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const directoryNameWithoutDuplicate = await fs_wrapper.nameWithoutDuplicate(
    notesJoinedParentPath,
    directoryName
  )
  await fs_wrapper.createDirectory(notesJoinedParentPath, directoryNameWithoutDuplicate)
}
export async function readDirectory(parentDirectoryPath, directoryName) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, directoryName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  return await fs_wrapper.readDirectory(notesJoinedParentPath, directoryName)
}
export async function readFolderRecursively(directoryPath, inode = null) {
  ThrowAnErrorIfAnyPathIsDangerous(directoryPath)
  return await fs_wrapper.readdirRecursively(notesJoin(directoryPath), inode)
}
export async function moveDirectory(parentDirectoryPath, directoryName, destinationDirectoryPath) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, directoryName, destinationDirectoryPath)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const notesJoinedDestinationPath = notesJoin(destinationDirectoryPath)
  const directoryNameWithoutDuplicate = await fs_wrapper.nameWithoutDuplicate(
    notesJoinedDestinationPath,
    directoryName
  )
  await fs_wrapper.moveDirectory(
    notesJoinedParentPath,
    directoryName,
    notesJoinedDestinationPath,
    directoryNameWithoutDuplicate
  )
}
export async function renameDirectory(parentDirectoryPath, directoryName, newDirectoryName) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, directoryName, newDirectoryName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const newDirectoryNameWithoutDuplicate = await fs_wrapper.nameWithoutDuplicate(
    notesJoinedParentPath,
    newDirectoryName
  )
  await fs_wrapper.renameDirectory(
    notesJoinedParentPath,
    directoryName,
    newDirectoryNameWithoutDuplicate
  )
}
export async function deleteDirectory(parentDirectoryPath, directoryName) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, directoryName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  await fs_wrapper.deleteDirectory(notesJoinedParentPath, directoryName)
}

export function createDownloadNote(parentDirectoryPath, title, category, tags, body) {
  return new Promise(function(resolve, reject) {
    var result = writeDownloadNote(parentDirectoryPath, title, category, tags, body)
    if (result) {
      resolve(result)
    } else {
      reject('新規作成エラー')
    }
  })
}

// 新規ノートダウンロード作成関数
async function writeDownloadNote(parentDirectoryPath, title, category, tags, body) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, title)
  parentDirectoryPath = parentDirectoryPath ? parentDirectoryPath : ''
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  mkdirp.sync(notesJoinedParentPath)

  const fileNameWithoutDuplicate = await fs_wrapper.nameWithoutDuplicate(
    notesJoinedParentPath,
    `${title}.md`
  )
  await fs_wrapper.writeFile(
    notesJoinedParentPath,
    fileNameWithoutDuplicate,
    convertNoteToString(title, category, tags, body)
  )
  return fileNameWithoutDuplicate
}

export async function overwriteDownloadNote(
  parentDirectoryPath,
  fileName,
  title,
  category,
  tags,
  body
) {
  overwriteNote(parentDirectoryPath, fileName, convertNoteToString(title, category, tags, body))
}

// ノートデータを文字列変換
export function convertNoteToString(title, category, tags, body) {
  var content = `title: ${title}\ncategory: ${category}\ntags:`
  var str_tags = tags.map(tag => tag.name).join(',')
  if (str_tags) {
    content += str_tags
  }
  content += `\n\n${body}`
  return content
}

export function moveDownloadNote(parentDirectoryPath, fileName, destinationDirectoryPath) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath)
  destinationDirectoryPath = destinationDirectoryPath ? destinationDirectoryPath : ''
  mkdirp.sync(notesJoin(parentDirectoryPath))
  moveNote(parentDirectoryPath, fileName, destinationDirectoryPath)
}

export async function readNoteBody(parentDirectoryPath, fileName) {
  ThrowAnErrorIfAnyPathIsDangerous(parentDirectoryPath, fileName)
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  let content = await fs_wrapper.readFile(notesJoinedParentPath, fileName)
  return extractContentToBody(content)
}

export class NotesWatchHandler {
  static callbackObject = null
  static start(callbackObject) {
    fs_wrapper.WatchHandler.start(store.state.root.rootPath, NotesWatchHandler)
    NotesWatchHandler.callbackObject = callbackObject
  }
  static kill() {
    fs_wrapper.WatchHandler.kill()
  }
  static onChangeNote(target) {
    target.parentDirectoryPath = notesRemove(target.parentDirectoryPath)
    NotesWatchHandler.callbackObject.onChangeNote(target)
  }
  static onCreateNote(target) {
    target.parentDirectoryPath = notesRemove(target.parentDirectoryPath)
    NotesWatchHandler.callbackObject.onCreateNote(target)
  }
  static onCreateDirectory(target) {
    target.parentDirectoryPath = notesRemove(target.parentDirectoryPath)
    NotesWatchHandler.callbackObject.onCreateDirectory(target)
  }
  static onDelete(target) {
    target.parentDirectoryPath = notesRemove(target.parentDirectoryPath)
    NotesWatchHandler.callbackObject.onDelete(target)
  }
}

function extractContentToBody(content) {
  content = content.replace(/\r\n?/g, '\n')
  let index = content.indexOf('\n\n')
  if (index != -1) {
    return content.substr(index + 2)
  }
  return '### 読み取りエラー'
}

export async function setHeader(header, parentDirectoryPath, fileName) {
  const body = (await readNoteBody(parentDirectoryPath, fileName)) ?? ''
  const content = `${header}\n\n${body}`
  overwriteNote(parentDirectoryPath, fileName, content)
}
