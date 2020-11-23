import * as fs_wrapper from './fs_wrapper'
import path from 'path'
import mkdirp from 'mkdirp'

export function notesJoin(parentDirectoryPath) {
  return path.join('notes', parentDirectoryPath)
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

function extractContentToBody(content) {
  let index = content.indexOf('\n\n')
  if (index != -1) {
    return content.substr(index + 2)
  }
  return false
}
