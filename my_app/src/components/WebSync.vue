<template>
  <div>
    <div class="sync" :class="{ load: isLoading }" @click="sync()">
      <img src="../images/sync.png" width="20" height="20" class="image" />
    </div>
  </div>
</template>

<script>
import api from './api'
import { mapState, mapMutations, mapGetters } from 'vuex'
import Note from '../models/Note'
import MyList from '../models/MyList'
import MyListNote from '../models/MyListNote'
import MyListNoteTag from '../models/MyListNoteTag'
import MyListNoteIndex from '../models/MyListNoteIndex'
import Tag from '../models/Tag'
import Category from '../models/Category'
import Directory from '../models/Directory'
import UpdatedAt from '../models/UpdatedAt'

import {
  createDownloadNote,
  notesJoin,
  overwriteDownloadNote,
  moveDownloadNote,
  deleteNote,
  readNoteBody
} from './NoteCRUD'
import fs from 'fs'

export default {
  data: function() {
    return {
      isLoading: false,
      intervalId: null
    }
  },
  computed: {
    ...mapState('user', ['userId', 'token']),
    ...mapGetters('category_module', ['get_default']),
    getAuthParams() {
      return { user_id: this.userId, token: this.token }
    },
    getAuthParamsStr() {
      return `user_id=${this.userId}&token=${this.token}`
    },
    categoriesUpdatedAt() {
      return UpdatedAt.find('categories').updated_at
    },
    tagsUpdatedAt() {
      return UpdatedAt.find('tags').updated_at
    },
    noteUploadsUpdatedAt() {
      return UpdatedAt.find('note_uploads').updated_at
    },
    noteDownloadsUpdatedAt() {
      return UpdatedAt.find('note_downloads').updated_at
    },
    updateTargetNotes() {
      return Note.query()
        .where(note => {
          return (
            (note.updated_at >= this.noteUploadsUpdatedAt || note.guid == null) && note.is_exists
          )
        })
        .with('parent_directory')
        .with('tags')
        .get()
    },
    deletedLocalNotes() {
      return Note.deletedLocalNotes()
    },
    directory() {
      return Directory.all()
    },
    tags() {
      return Tag.all()
    },
    categories() {
      return Category.all()
    }
  },
  created() {
    this.isLoading = false
    this.sync()
    this.intervalId = setInterval(function() {
      this.sync()
    }, 1000 * 60 * 5)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  },
  methods: {
    ...mapMutations('user', ['setUser', 'reset']),
    ...mapMutations('category_module', ['set_default_id']),
    createNote() {
      api
        .post('/api/v1/notes/uploads', {
          ...this.getAuthParams,
          notes: [this.note]
        })
        .then(response => (this.note.guid = response.data[0].guid))
    },
    async sync() {
      if (this.isLoading) return
      this.isLoading = true
      await this.categoriesSync()
      await this.noteUploads()
      await this.tagsSync()
      this.noteDownloads()
      this.noteDeletes()
      this.myListSync()
      this.isLoading = false
    },
    requestCategories(updatedAt) {
      return api.get(`/api/v1/categories?${this.getAuthParamsStr}&updated_at=${updatedAt}`)
    },
    requestTags(updatedAt) {
      return api.get(`/api/v1/tags?${this.getAuthParamsStr}&updated_at=${updatedAt}`)
    },
    requestUploadNotes(notes) {
      return api.post('/api/v1/notes/uploads', { ...this.getAuthParams, notes: notes })
    },
    async categoriesSync() {
      const categoryAt = new Date().getTime()
      const response = await this.requestCategories(
        new Date(this.categoriesUpdatedAt).toUTCString()
      )
      for (let category of response.data.categories) {
        Category.insert({
          data: {
            online_id: category.id,
            name: category.name
          }
        })
      }
      this.updateDefaultCategory(response.data.default_category)
      this.updateCategoriesUpdatedAt(categoryAt)
    },
    updateDefaultCategory(default_category) {
      Note.update({
        where: note => {
          return note.category_id == this.get_default.online_id
        },
        data: { category_id: default_category.id }
      })
      Category.delete(0)
      this.set_default_id(default_category.id)
    },
    async tagsSync() {
      const tagAt = new Date().getTime()
      const response = await this.requestTags(new Date(this.categoriesUpdatedAt).toUTCString())
      for (var tag of response.data) {
        const localTag = Tag.query()
          .where('name', tag.name)
          .first()
        if (localTag) {
          Tag.update({ where: localTag.id, data: { online_id: tag.id } })
        } else {
          Tag.insert({ data: { online_id: tag.id, name: tag.name } })
        }
      }
      this.updateTagsUpdatedAt(tagAt)
    },
    async shapedNotes() {
      let notes = []
      for (let note of this.updateTargetNotes) {
        notes.push({
          local_id: note.inode,
          guid: note.guid,
          title: note.title,
          body: await readNoteBody(note.parent_directory_path_from_root, note.file_name),
          category_id: note.category_id,
          directory_path: note.parent_directory_path_from_root.replace('\\', '/'),
          tags: note.tags.map(tag => {
            return { id: tag.online_id ?? '', name: tag.name }
          })
        })
      }
      return notes
    },
    async noteUploads() {
      let notes = await this.shapedNotes()
      const uploadAt = new Date().getTime()
      const response = await this.requestUploadNotes(notes)
      for (var note of response.data) {
        if (note.guid) {
          Note.update({
            where: note.local_id,
            data: { guid: note.guid, updated_at: uploadAt }
          })
        }
      }
      this.updateUploadsUpdatedAt(uploadAt + 1)
    },
    noteDownloads() {
      const downloadAt = new Date().getTime()
      api
        .get(
          `/api/v1/notes/downloads?${this.getAuthParamsStr}&updated_at=${new Date(
            this.noteDownloadsUpdatedAt
          ).toUTCString()}`
        )
        .then(response => {
          for (let note of response.data.notes) {
            this.noteUpdate(note, downloadAt)
          }
          for (let deleted_note of response.data.deleted_notes) {
            this.downloadNoteDeletes(deleted_note)
          }
          // 全てが正常に終わったので時間更新 ダウンロードより後にupdateを設定する
          this.updateDownloadsUpdatedAt(downloadAt + 1)
          this.updateUploadsUpdatedAt(downloadAt + 1)
        })
    },
    noteUpdate(note, downloadAt) {
      let local_note = Note.query()
        .where('guid', note.guid)
        .first()
      if (local_note) {
        overwriteDownloadNote(
          local_note.parent_directory_path_from_root,
          local_note.file_name,
          note.title,
          Category.find(note.category_id).name,
          note.tags,
          note.body
        )
        if (note.directory_path == null) note.directory_path = ''
        if (local_note.parent_directory_path_from_root.replace('\\', '/') != note.directory_path) {
          moveDownloadNote(
            local_note.parent_directory_path_from_root,
            note.file_name,
            note.directory_path
          )
        }
        Note.update({
          where: local_note.inode,
          data: { updated_at: downloadAt }
        })
      } else {
        createDownloadNote(
          note.directory_path,
          note.title,
          Category.find(note.category_id).name,
          note.tags,
          note.body
        ).then(noteFileName => {
          let note_inode = fs.statSync(`${notesJoin(note.directory_path)}/${noteFileName}`).ino
          Note.insertOrUpdate({
            data: {
              inode: note_inode,
              guid: note.guid,
              updated_at: downloadAt
            }
          })
        })
      }
    },
    downloadNoteDeletes(deleted_note) {
      let note = Note.query()
        .where('guid', deleted_note.guid)
        .first()
      if (note) {
        deleteNote(note.parent_directory_path_from_root, note.file_name)
        Note.delete(note.inode)
      }
    },
    notExistsNotes() {
      return Note.query()
        .where(note => {
          return note.is_exists == false
        })
        .all()
        .map(note => {
          return { guid: note.guid }
        })
    },
    noteDeletes() {
      let notExistsNotes = this.notExistsNotes()
      api
        .delete('/api/v1/notes', {
          ...this.getAuthParams,
          notes: notExistsNotes
        })
        .then(response => {
          for (let deletedNote of response.data) {
            let note = Note.query()
              .where('guid', deletedNote.guid)
              .first()
            if (note) {
              Note.delete(note.inode)
            }
          }
        })
    },
    myListSync() {
      api.get(`/api/v1/my_lists?${this.getAuthParamsStr}`).then(response => {
        MyListNoteIndex.deleteAll()
        MyListNoteTag.deleteAll()
        MyList.deleteAll()
        MyListNote.deleteAll()
        for (let my_list of response.data) {
          MyList.insertOrUpdate({
            data: {
              id: my_list.id,
              title: my_list.title,
              category_id: my_list.category_id,
              description: my_list.description ?? ''
            }
          })
          for (let note of my_list.notes) {
            MyListNote.insertOrUpdate({
              data: {
                id: note.id,
                title: note.title,
                body: note.body,
                nickname: note.nickname,
                category_id: note.category_id
              }
            })
            MyListNoteIndex.insertOrUpdate({
              data: {
                my_list_id: my_list.id,
                my_list_note_id: note.id,
                index: note.index
              }
            })
            for (let tag of note.tags) {
              let local_tag = Tag.query()
                .where('online_id', tag.id)
                .first()
              if (local_tag == null) return
              MyListNoteTag.insertOrUpdate({
                data: {
                  tag_id: local_tag.id,
                  my_list_note_id: note.id
                }
              })
            }
          }
        }
      })
    },
    updateTagsUpdatedAt(updated_at) {
      if (this.noteUploadsUpdatedAt <= updated_at) {
        this.updateUpdatedAt('tags', updated_at)
      }
    },
    updateCategoriesUpdatedAt(updated_at) {
      if (this.noteUploadsUpdatedAt <= updated_at) {
        this.updateUpdatedAt('categories', updated_at)
      }
    },
    updateDownloadsUpdatedAt(updated_at) {
      if (this.noteDownloadsUpdatedAt <= updated_at) {
        this.updateUpdatedAt('note_downloads', updated_at)
      }
    },
    updateUploadsUpdatedAt(updated_at) {
      if (this.noteUploadsUpdatedAt <= updated_at) {
        this.updateUpdatedAt('note_uploads', updated_at)
      }
    },
    updateUpdatedAt(label, updated_at) {
      UpdatedAt.update({
        where: label,
        data: {
          updated_at: updated_at
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.sync
  cursor: pointer
  background-color: #fff
  border-radius: 5px
  width: 25px
  height: 25px
  display: flex
  align-items: center
  &:hover
    background-color: #ccc
  .image
    display: block
    margin: auto
.load
  background-color: #adff2f !important
  pointer-events: none
</style>
