import * as NoteCRUD from './NoteCRUD'
import Note from '../models/Note'
import Directory from '../models/Directory'

export async function start() {
  const notes = Note.all()
  const notesMap = {}
  for (const note of notes) {
    note.is_exists = false
    notesMap[note.inode] = note
  }
  const children = await NoteCRUD.readFolderRecursively('')
  await insertChildren(notesMap, children)
  NotesWatcher.start()
}

export function stop() {
  NotesWatcher.kill()
}

function isNoteFile(fileName) {
  return fileName.endsWith('.md')
}

async function insertChildren(allNotes, children) {
  let directory_data = []
  let promises = []
  for (let child of children) {
    if (child.isDirectory) {
      directory_data.push({
        inode: child.inode,
        directory_name: child.name,
        parent_inode: child.parent_inode
      })
    } else if (isNoteFile(child.name)) {
      allNotes[child.inode] = {
        ...allNotes[child.inode],
        inode: child.inode,
        parent_inode: child.parent_inode,
        file_name: child.name,
        is_exists: true,
        updated_at: child.updated_at
      }
    }
  }
  promises.push(
    Directory.insert({
      data: directory_data
    })
  )
  await noteInsertChlidren(Object.keys(allNotes).map(key => allNotes[key]))
}

async function noteInsertChlidren(note_data) {
  const promises = note_data.map(note => Note.hydrateUpdatedHeader(note))
  const records = await Promise.all(promises)
  await Note.deleteAll()
  await Note.insert({
    data: records.map(record => record.record)
  })
  await Note.updateTags(records.filter(record => record?.tags != undefined))
}
async function noteInsert(aRecord) {
  const { record, note, tags } = await Note.hydrateUpdatedHeader(aRecord)
  Note.insertOrUpdate({ data: record })
  if (record?.tags != undefined) {
    note.updateTags(tags)
  }
}

class NotesWatcher {
  static start() {
    NoteCRUD.NotesWatchHandler.start(NotesWatcher)
  }
  static kill() {
    NoteCRUD.NotesWatchHandler.kill()
  }
  static async onChangeNote(target) {
    const note = Note.find(target.stat.ino)
    note.updated_at = target.stat.mtimeMs
    noteInsert(note)
  }
  static async onCreateNote(target) {
    if (!isNoteFile(target.name)) {
      return
    }
    noteInsert({
      inode: target.stat.ino,
      parent_inode: NoteCRUD.getInode(target.parentDirectoryPath),
      file_name: target.name,
      is_exists: true,
      updated_at: target.stat.mtimeMs
    })
  }
  static async onCreateDirectory(target) {
    const directories = await Directory.insertOrUpdate({
      data: {
        inode: target.stat.ino,
        parent_inode: NoteCRUD.getInode(target.parentDirectoryPath),
        directory_name: target.name
      }
    })
    const directory = directories.directories[0]
    const children = await NoteCRUD.readFolderRecursively(directory.path_from_root, directory.inode)
    const notes = Note.all()
    const notesMap = {}
    for (const note of notes) {
      notesMap[note.inode] = note
    }
    insertChildren(notesMap, children)
  }
  static async onDelete(target) {
    const note = Note.getNote(target.parentDirectoryPath, target.name)
    if (note) {
      note.is_exists = false
      await note.$save()
    } else {
      await Directory.getDirectory(target.parentDirectoryPath, target.name)?.deleteWithChildren()
    }
  }
}
