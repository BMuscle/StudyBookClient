import * as fs_wrapper from './fs_wrapper'
import path from 'path'
import mkdirp from 'mkdirp'

export function notesJoin(parentDirectoryPath) {
  return path.join('notes', parentDirectoryPath)
}
function notesRemove(path) {
  return path.slice(6)
}
export function getInode(path) {
  if (path === '') {
    return null
  }
  const notesJoinedPath = notesJoin(path)
  return fs_wrapper.getInode(notesJoinedPath)
}
export function getMtimeMs(parentDirectoryPath, fileName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  return fs_wrapper.getMtimeMs(notesJoinedParentPath, fileName)
}
export async function createNote(parentDirectoryPath, fileName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const fileNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(
    notesJoinedParentPath,
    fileName
  )
  await fs_wrapper.createFile(notesJoinedParentPath, fileNameWithoutDuplicate)
}
export async function readNote(parentDirectoryPath, fileName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  return await fs_wrapper.readFile(notesJoinedParentPath, fileName)
}
export async function readNoteHeader(parentDirectoryPath, fileName) {
  const note = await readNote(parentDirectoryPath, fileName)
  var rows = note.split(/\r\n|\n/)
  var title = ''
  var category = ''
  var tags = []

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
          title = data
          break
        case 'category':
          category = data
          break
        case 'tags':
          tags = data.split(/,/).map(tag => tag.trim())
          break
      }
    }
  } catch (error) {
    console.log('ヘッダーを読み取れませんでした', parentDirectoryPath, fileName)
  }
  return {
    title: title,
    category: category,
    tags: tags
  }
}
export async function overwriteNote(parentDirectoryPath, fileName, content) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  await fs_wrapper.overwriteFile(notesJoinedParentPath, fileName, content)
}
export async function moveNote(
  parentDirectoryPath,
  fileName,
  destinationDirectoryPath
) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const notesJoinedDestinationPath = notesJoin(destinationDirectoryPath)
  const fileNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(
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
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const newFileNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(
    notesJoinedParentPath,
    newFileName
  )
  await fs_wrapper.renameFile(
    notesJoinedParentPath,
    fileName,
    newFileNameWithoutDuplicate
  )
}
export async function deleteNote(parentDirectoryPath, fileName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  await fs_wrapper.deleteFile(notesJoinedParentPath, fileName)
}
export async function createDirectory(parentDirectoryPath, directoryName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const directoryNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(
    notesJoinedParentPath,
    directoryName
  )
  await fs_wrapper.createDirectory(
    notesJoinedParentPath,
    directoryNameWithoutDuplicate
  )
}
export async function readDirectory(parentDirectoryPath, directoryName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  return await fs_wrapper.readDirectory(notesJoinedParentPath, directoryName)
}
export async function readFolderRecursively(directoryPath, inode = null) {
  return await fs_wrapper.readdirRecursively(notesJoin(directoryPath), inode)
}
export async function moveDirectory(
  parentDirectoryPath,
  directoryName,
  destinationDirectoryPath
) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const notesJoinedDestinationPath = notesJoin(destinationDirectoryPath)
  const directoryNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(
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
export async function renameDirectory(
  parentDirectoryPath,
  directoryName,
  newDirectoryName
) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  const newDirectoryNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(
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
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  await fs_wrapper.deleteDirectory(notesJoinedParentPath, directoryName)
}

export function createDownloadNote(
  parentDirectoryPath,
  title,
  category,
  tags,
  body
) {
  return new Promise(function(resolve, reject) {
    var result = writeDownloadNote(
      parentDirectoryPath,
      title,
      category,
      tags,
      body
    )
    if (result) {
      resolve(result)
    } else {
      reject('新規作成エラー')
    }
  })
}

// 新規ノートダウンロード作成関数
async function writeDownloadNote(
  parentDirectoryPath,
  title,
  category,
  tags,
  body
) {
  parentDirectoryPath = parentDirectoryPath ? parentDirectoryPath : ''
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  mkdirp.sync(notesJoinedParentPath)

  const fileNameWithoutDuplicate = fs_wrapper.nameWithoutDuplicate(
    notesJoinedParentPath,
    `${title}.md`
  )
  await fs_wrapper.createFile(notesJoinedParentPath, fileNameWithoutDuplicate)
  await fs_wrapper.overwriteFile(
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
  overwriteNote(
    parentDirectoryPath,
    fileName,
    convertNoteToString(title, category, tags, body)
  )
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

export function moveDownloadNote(
  parentDirectoryPath,
  fileName,
  destinationDirectoryPath
) {
  destinationDirectoryPath = destinationDirectoryPath
    ? destinationDirectoryPath
    : ''
  mkdirp.sync(notesJoin(parentDirectoryPath))
  moveNote(parentDirectoryPath, fileName, destinationDirectoryPath)
}

export async function readNoteBody(parentDirectoryPath, fileName) {
  const notesJoinedParentPath = notesJoin(parentDirectoryPath)
  let content = await fs_wrapper.readFile(notesJoinedParentPath, fileName)
  return extractContentToBody(content)
}

export class NotesWatchHandler {
  static callbackObject = null
  static start(callbackObject) {
    fs_wrapper.WatchHandler.start('notes', NotesWatchHandler)
    NotesWatchHandler.callbackObject = callbackObject
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
  let index = content.indexOf('\n\n')
  if (index != -1) {
    return content.substr(index + 2)
  }
  return false
}
