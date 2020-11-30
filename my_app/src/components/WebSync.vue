<template>
  <div>
    <button @click="init()">初期化</button>
    <button @click="sync()">同期</button>
    <!-- <div>
      <div>UserId確認 {{user}}</div>
      <div>NoteUpload確認 {{noteUploadsUpdatedAt}}</div>
      <div>NoteDownload確認 {{noteDownloadsUpdatedAt}}</div>
      <div>アップデート対象ノート確認 {{updateTargetNotes}}</div>
      <div>ディレクトリ確認 {{directory}}</div>
      <div>タグ確認 {{tags}}</div>
      <div>カテゴリ確認 {{categories}}</div>
    </div> -->
  </div>
</template>

<script>
import api from './api'
import axios from 'axios'
import User from '../models/User'
import Note from '../models/Note'
import MyList from '../models/MyList'
import MyListNote from '../models/MyListNote'
import MyListNoteTag from '../models/MyListNoteTag'
import MyListNoteIndex from '../models/MyListNoteIndex'
import Tag from '../models/Tag'
import NoteTag from '../models/NoteTag'
import Category from '../models/Category'
import Directory from '../models/Directory'
import UpdatedAt from '../models/UpdatedAt'
import DeletedLocalNote from '../models/DeletedLocalNote'
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
  computed: {
    getAuthParams() {
      return { user_id: this.user.user_id, token: this.user.token }
    },
    user() {
      return User.all()[0]
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
            note.updated_at >= this.noteUploadsUpdatedAt || note.guid == null
          )
        })
        .with('parent_directory')
        .with('tags')
        .get()
    },
    deletedLocalNotes() {
      return DeletedLocalNote.all()
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
  methods: {
    createNote() {
      api
        .post('/api/v1/notes/uploads', {
          ...this.getAuthParams,
          notes: [this.note]
        })
        .then(response => (this.note.guid = response.data[0].guid))
    },
    sync() {
      this.categoriesSync()
      this.noteUploads()
      this.tagsSync()
      this.noteDownloads()
      this.noteDeletes()
      this.myListSync()
    },
    categoriesSync() {
      const categoryAt = new Date().getTime()
      api
        .get(
          `/api/v1/categories?user_id=${this.getAuthParams.user_id}&token=${
            this.getAuthParams.token
          }&updated_at=${new Date(this.categoriesUpdatedAt).toUTCString()}`
        )
        .then(response => {
          for (var category of response.data) {
            Category.insert({
              data: {
                online_id: category.id,
                name: category.name
              }
            })
          }
          this.updateCategoriesUpdatedAt(categoryAt)
        })
    },
    tagsSync() {
      const tagAt = new Date().getTime()
      api
        .get(
          `/api/v1/tags?user_id=${this.getAuthParams.user_id}&token=${
            this.getAuthParams.token
          }&updated_at=${new Date(this.categoriesUpdatedAt).toUTCString()}`
        )
        .then(response => {
          for (var tag of response.data) {
            if (
              Tag.query()
                .where('online_id', tag.id)
                .exists()
            )
              // タグの存在確認
              Tag.insert({
                data: {
                  online_id: tag.id,
                  name: tag.name
                }
              })
          }
          this.updateTagsUpdatedAt(tagAt)
        })
    },
    noteUploads() {
      // 更新対象取得 整形
      let notes = this.updateTargetNotes.map(note => {
        return {
          local_id: note.inode,
          guid: note.guid,
          title: note.title,
          text: readNoteBody(
            note.parent_directory.path_from_root,
            note.file_name
          ),
          category_id: note.category_id,
          file_path: note.parent_directory.path_from_root,
          tags: note.tags.map(tag => {
            return { id: tag.online_id, name: tag.name }
          })
        }
      })
      // 送信
      const uploadAt = new Date().getTime()
      api
        .post('/api/v1/notes/uploads', { ...this.getAuthParams, notes: notes })
        .then(response => {
          // GUIDの保存だけ行う。
          for (var note of response.data) {
            if (note.guid) {
              // 更新成功チェック
              Note.update({
                where: note.local_id,
                data: {
                  guid: note.guid,
                  updated_at: uploadAt
                }
              })
            }
          }
          this.updateUploadsUpdatedAt(uploadAt + 1)
        })
    },
    noteDownloads() {
      const downloadAt = new Date().getTime()
      api
        .get(
          `/api/v1/notes/downloads?user_id=${
            this.getAuthParams.user_id
          }&token=${this.getAuthParams.token}&updated_at=${new Date(
            this.noteDownloadsUpdatedAt
          ).toUTCString()}`
        )
        .then(response => {
          for (let note of response.data.notes) {
            this.noteUpdate(note, downloadAt)
          }
          // ノートの削除
          for (let deleted_note of response.data.deleted_notes) {
            let note = User.query().where('guid', deleted_note.guid) // 存在する場合にだけ、削除
            if (note) {
              deleteNote(note.parent_directory.path_from_root, note.file_name) // 削除できなくても問題なし
            }
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
        // 存在する
        overwriteDownloadNote(
          local_note.parent_directory.path_from_root,
          local_note.file_name,
          note.title,
          note.category,
          note.tags,
          note.body
        )
        if (local_note.parent_directory.path_from_root != note.directory_path) {
          // フォルダ移動
          moveDownloadNote(
            local_note.parent_directory.path_from_root,
            note.file_name,
            note.directory_path
          )
        }
        Note.update({
          where: local_note.inode,
          data: { updated_at: downloadAt }
        })
      } else {
        // 存在しない
        // ノートファイル & ディレクトリ の追加
        createDownloadNote(
          note.directory_path,
          note.title,
          note.category_id,
          note.tags,
          note.text
        ).then(noteFileName => {
          // ディレクトリ、ノートは監視で追加されるので、guidと、inodeをセットする
          let note_inode = fs.statSync(
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
    noteDeletes() {
      let deleteNotes = this.deletedLocalNotes.map(note => {
        return { guid: note.guid }
      })
      api
        .delete('/api/v1/notes', { ...this.getAuthParams, notes: deleteNotes })
        .then(response => {
          for (let note of response.data) {
            User.update({
              where: note.local_id,
              data: {
                guid: note.guid
              }
            })
          }
        })
    },
    myListSync() {
      const downloadAt = new Date().getTime()
      let deleteNotes = this.deletedLocalNotes.map(note => {
        return { guid: note.guid }
      })
      // 現状、マイリストは更新時間によるパフォーマンス向上を行なっていない。
      api
        .get(
          `/api/v1/my_lists?user_id=${this.getAuthParams.user_id}&token=${
            this.getAuthParams.token
          }`
        )
        .then(response => {
          // 一旦削除後に追加
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
                description: my_list.description,
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
                  my_list_note_id: note.id
                }
              })
              for (let tag of note.tags) {
                MyListNoteTag.insertOrUpdate({
                  data: {
                    tag_id: tag.id,
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
    },
    init() {
      // テストデータ初期化用
      UpdatedAt.insert({ data: { label: 'my_lists', updated_at: 0 } })
      UpdatedAt.insert({ data: { label: 'tags', updated_at: 0 } })
      UpdatedAt.insert({ data: { label: 'categories', updated_at: 0 } })
      UpdatedAt.insert({ data: { label: 'note_downloads', updated_at: 0 } })
      UpdatedAt.insert({ data: { label: 'note_uploads', updated_at: 0 } })
      Tag.insert({ data: { id: 1, name: 'test_tag' } })
      Note.insert({
        data: {
          inode: 1,
          file_name: 'test.md',
          title: '',
          category_id: 1,
          updated_at: new Date().getTime(),
          parent_inode: 3
        }
      })
      Note.insert({
        data: {
          inode: 2,
          file_name: 'test1.md',
          title: 'テスト2',
          category_id: 1,
          updated_at: 0,
          parent_inode: 3
        }
      })
      Note.deleteAll()
      NoteTag.insert({ data: { tag_id: 1, note_inode: 1 } })
      Category.insert({ data: { online_id: 1, name: 'プログラミング' } })
      Directory.insert({
        data: {
          inode: 3,
          parent_inode: null,
          directory_name: 'notes',
          path_from_root: 'folder'
        }
      })
      DeletedLocalNote.deleteAll()
      // DeletedLocalNote.insert( { data: { guid: "b009531a-680f-4a89-b2d2-ee062307fdb4"}})
    }
  }
}
</script>

<style lang="scss"></style>
