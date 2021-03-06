<template>
  <div>
    <div class="sync" :class="{ load: isLoading }" @click="sync()">
      <img src="../images/sync.png" width="20" height="20" class="image" />
    </div>
  </div>
</template>

<script>
import api from './api'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
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
    ...mapState('user', ['agentGuid', 'token']),
    ...mapState('category_module', ['default_id']),
    getAuthParams() {
      return { agent_guid: this.agentGuid, token: this.token }
    },
    getAuthParamsStr() {
      return `agent_guid=${this.agentGuid}&token=${this.token}`
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
    setTimeout(this.sync, 20000)
    this.intervalId = setInterval(this.sync, 1000 * 60 * 5)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  },
  methods: {
    ...mapMutations('user', ['reset']),
    ...mapMutations('category_module', ['set_default_id']),
    ...mapActions('flash', ['setDanger']),
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
      try {
        await this.categoriesSync()
        await this.noteUploads()
        await this.tagsSync()

        let promises = []
        promises.push(this.noteDownloads())
        promises.push(this.noteDeletes())
        promises.push(this.myListSync())
        await Promise.all(promises)

        this.isLoading = false
      } catch (e) {
        if (e.message == 'Network Error') {
          this.setDanger(['通信エラーが発生しました'])
        } else if (e.message == 'Request failed with status code 400') {
          this.setDanger(['リクエストに失敗しました。アカウントが利用できない可能性があります'])
        } else if (e.message == 'Request failed with status code 404') {
          this.setDanger(['リクエストに失敗しました。バージョンが古い可能性があります'])
        } else {
          console.log('Sync error', e)
          this.setDanger(['同期に失敗しました'])
        }
        this.isLoading = false
      }
    },
    requestCategories(updatedAt) {
      return api.get(`/api/v1/categories?${this.getAuthParamsStr}`)
    },
    requestTags(updatedAt) {
      return api.get(`/api/v1/tags?${this.getAuthParamsStr}&updated_at=${updatedAt}`)
    },
    requestUploadNotes(notes) {
      return api.post('/api/v1/notes/uploads', { ...this.getAuthParams, notes: notes })
    },
    async categoriesSync() {
      const response = await this.requestCategories()
      Category.deleteAll()
      Category.insert({
        data: response.data.categories.map(category => {
          return { online_id: category.id, name: category.name }
        })
      })
      this.updateDefaultCategory(response.data.default_category)
    },
    updateDefaultCategory(default_category) {
      if (default_category.id == this.default_id) return
      Note.update({
        where: note => {
          return note.category_id == this.default_id || note.category_id == null
        },
        data: { category_id: default_category.id }
      })
      this.set_default_id(default_category.id)
    },
    async tagsSync() {
      const tagAt = new Date().getTime()
      const response = await this.requestTags(new Date(this.categoriesUpdatedAt).toUTCString())
      let insertTag = []

      for (var tag of response.data) {
        const localTag = Tag.query()
          .where('name', tag.name)
          .first()
        if (localTag) {
          Tag.update({ where: localTag.id, data: { online_id: tag.id } })
        } else {
          insertTag.push(Tag.hydrateId({ online_id: tag.id, name: tag.name }))
        }
      }
      Tag.insert({ data: insertTag })
      this.updateTagsUpdatedAt(tagAt)
    },
    async noteRead(note) {
      return {
        local_id: note.inode,
        guid: note.guid,
        title: note.title,
        body: await readNoteBody(note.parent_directory?.path_from_root || '', note.file_name),
        category_id: note.category_id,
        directory_path: note.parent_directory?.path_from_root.replace('\\', '/') || '',
        tags: note.tags.map(tag => {
          return { id: tag.online_id ?? '', name: tag.name }
        })
      }
    },
    async shapedNotes() {
      let promises = []
      for (let note of this.updateTargetNotes) {
        promises.push(this.noteRead(note))
      }
      return await Promise.all(promises)
    },
    async noteUploads() {
      let notes = await this.shapedNotes()
      if (notes.length == 0) return
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
    async noteDownloads() {
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
          this.downloadNoteDeletes(response.data.deleted_notes)
          // 全てが正常に終わったので時間更新 ダウンロードより後にupdateを設定する
          this.updateDownloadsUpdatedAt(downloadAt + 1)
          this.updateUploadsUpdatedAt(downloadAt + 1)
        })
    },
    async noteUpdate(note, downloadAt) {
      let local_note = Note.query()
        .where('guid', note.guid)
        .with('parent_directory')
        .first()
      if (local_note) {
        if (!local_note.is_exists) {
          return
        }
        overwriteDownloadNote(
          local_note.parent_directory?.path_from_root || '',
          local_note.file_name,
          note.title,
          Category.find(note.category_id).name,
          note.tags,
          note.body
        )
        if (note.directory_path == null) note.directory_path = ''
        if (
          (local_note.parent_directory?.path_from_root.replace('\\', '/') || '') !=
          note.directory_path
        ) {
          moveDownloadNote(
            local_note.parent_directory?.path_from_root || '',
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
        ).then(async noteFileName => {
          let note_inode = await fs.promises.stat(
            `${notesJoin(note.directory_path)}/${noteFileName}`
          ).ino
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
    downloadNoteDeletes(deleted_notes) {
      if (deleted_notes.length == 0) return

      let notes = Note.query()
        .where(
          'guid',
          deleted_notes.map(note => note.guid)
        )
        .where('is_exists', true)
        .with('parent_directory')
        .get()

      if (notes.length == 0) return

      for (let note of notes) {
        deleteNote(note.parent_directory?.path_from_root || '', note.file_name)
        Note.delete(note.inode)
      }
    },
    notExistsNotes() {
      return Note.query()
        .where(note => {
          return note.is_exists == false
        })
        .get()
        .map(note => {
          return { guid: note.guid }
        })
    },
    async noteDeletes() {
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
    async myListSync() {
      api.get(`/api/v1/my_lists?${this.getAuthParamsStr}`).then(response => {
        MyListNoteIndex.deleteAll()
        MyListNoteTag.deleteAll()
        MyList.deleteAll()
        MyListNote.deleteAll()

        const my_lists = response.data.map(my_list => {
          return {
            id: my_list.id,
            title: my_list.title,
            category_id: my_list.category_id,
            description: my_list.description ?? ''
          }
        })
        MyList.insert({
          data: my_lists
        })

        for (let my_list of response.data) {
          const my_list_notes = my_list.notes.map(note => {
            return {
              id: note.id,
              title: note.title,
              body: note.body,
              nickname: note.nickname,
              category_id: note.category_id
            }
          })
          MyListNote.insert({
            data: my_list_notes
          })

          const my_list_note_index = my_list.notes.map(note => {
            return {
              my_list_id: my_list.id,
              my_list_note_id: note.id,
              index: note.index
            }
          })

          MyListNoteIndex.insert({
            data: my_list_note_index
          })

          for (let note of my_list.notes) {
            const tags = note.tags.map(tag => {
              let local_tag = Tag.query()
                .where('online_id', tag.id)
                .first()
              return {
                tag_id: local_tag.id,
                my_list_note_id: note.id
              }
            })
            MyListNoteTag.insert({
              data: tags
            })
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
