import * as NoteCRUD from './NoteCRUD'
import Note from '../models/Note'
import Directory from '../models/Directory'

export async function start() {
  await Note.updateAllNotes({ is_exists: false })
  const children = await NoteCRUD.readFolderRecursively('')
  await insertChildren(children)
  NotesWatcher.start()
}

export function stop() {
  NotesWatcher.kill()
}

function isNoteFile(fileName) {
  return fileName.endsWith('.md')
}

async function insertChildren(children) {
  let directory_data = []
  let note_data = []
  let promises = []
  for (let child of children) {
    if (child.isDirectory) {
      directory_data.push({
        inode: child.inode,
        directory_name: child.name,
        parent_inode: child.parent_inode
      })
    } else if (isNoteFile(child.name)) {
      note_data.push({
        inode: child.inode,
        parent_inode: child.parent_inode,
        file_name: child.name,
        is_exists: true
      })
    }
  }
  promises.push(
    Directory.insert({
      data: directory_data
    })
  )
  promises.push(
    Note.insertOrUpdate({
      data: note_data
    })
  )
  const [result_directories, result_notes] = await Promise.all(promises)
  if (Object.keys(result_notes).length) {
    for (let note of result_notes.notes) {
      note.updateHeadAndUpdatedAt()
    }
  }
}

class NotesWatcher {
  static start() {
    NoteCRUD.NotesWatchHandler.start(NotesWatcher)
  }
  static kill() {
    NoteCRUD.NotesWatchHandler.kill()
  }
  static onChangeNote(target) {
    Note.find(target.stat.ino).updateHeadAndUpdatedAt()
  }
  static onCreateNote(target) {
    if (!isNoteFile(target.name)) {
      return
    }
    Note.insertOrUpdate({
      data: {
        inode: target.stat.ino,
        parent_inode: NoteCRUD.getInode(target.parentDirectoryPath),
        file_name: target.name,
        is_exists: true
      }
    }).then(notes => {
      notes.notes[0].updateHeadAndUpdatedAt(target.stat.mtimeMs)
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
    insertChildren(children)
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
