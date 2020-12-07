import * as NoteCRUD from './NoteCRUD'
import Note from '../models/Note'
import Directory from '../models/Directory'

export async function onAppReady() {
  await Note.updateAllNotes({ is_exists: false })
  const children = await NoteCRUD.readFolderRecursively('')
  insertChildren(children)
  setNotesWatcher()
}

function insertChildren(children) {
  children
    .filter(child => child.isDirectory)
    .forEach(directory => {
      directory.directory_name = directory.name
      Directory.insert({ data: directory })
    })
  children
    .filter(child => !child.isDirectory)
    .forEach(note => {
      note.is_exists = true
      note.file_name = note.name
      Note.insertOrUpdate({ data: note }).then(notes => {
        notes.notes[0].updateHeadAndUpdatedAt()
      })
    })
}

export async function setNotesWatcher() {
  NoteCRUD.notesWatchHandler({
    async onChange(target) {
      Note.find(target.stat.inode).updateHeadAndUpdatedAt()
    },
    onCreate(target) {
      if (target.stat.isFile()) {
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
      } else {
        Directory.insertOrUpdate({
          data: {
            inode: target.stat.ino,
            parent_inode: NoteCRUD.getInode(target.parentDirectoryPath),
            directory_name: target.name
          }
        }).then(async directories => {
          const directory = directories.directories[0]
          const children = await NoteCRUD.readFolderRecursively(
            directory.path_from_root,
            directory.inode
          )
          insertChildren(children)
        })
      }
    },
    async onDelete(target) {
      const note = await Note.getNote(target.parentDirectoryPath, target.name)
      if (note) {
        await Note.update({ where: note.inode, data: { is_exists: false } })
      } else {
        Directory.getDirectory(
          target.parentDirectoryPath,
          target.name
        )?.deleteWithChildren()
      }
    }
  })
}
