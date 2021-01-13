<template>
  <div class="left-bar">
    <div>
      <BookmarkDirectory />
    </div>
    <div class="directory-tree-view">
      <DirectoryTreeView />
    </div>
    <hr />
    <div class="search-notes">
      <SearchNotes />
    </div>
    <div class="note-filter-by-category">
      <NotesFilterByCategory />
    </div>
    <filterdNotes />
    <div
      id="left_bar_bar"
      class="move-bar"
      @mousemove="widthChange($event)"
      @mousedown="widthChangeOn()"
      @mouseup="widthChangeOff()"
      @mouseover="widthChangeOff()"
    ></div>
  </div>
</template>

<script>
import SearchNotes from '../components/SearchNotes'
import NotesFilterByCategory from '../components/NotesFilterByCategory'
import filterdNotes from '../components/filterdNotes.vue'
import DirectoryTreeView from '../components/DirectoryTreeView'
import BookmarkDirectory from '../components/BookmarkDirectory.vue'
export default {
  components: {
    SearchNotes,
    NotesFilterByCategory,
    filterdNotes,
    DirectoryTreeView,
    BookmarkDirectory
  },
  data: function() {
    return {
      isWidthChange: false
    }
  },
  methods: {
    widthChange(event) {
      if (this.isWidthChange) {
        if (event.clientX > 400) {
          event.srcElement.parentNode.style.width = '400px'
          event.srcElement.style.left = '400px'
        } else if (event.clientX > 180) {
          event.srcElement.parentNode.style.width = `${event.clientX}px`
          event.srcElement.style.left = `${event.clientX}px`
        } else {
          event.srcElement.parentNode.style.width = '180px'
          event.srcElement.style.left = '180px'
        }
      }
    },
    widthChangeOn() {
      this.isWidthChange = true
      event.srcElement.classList.add('move-bar-active')
    },
    widthChangeOff() {
      this.isWidthChange = false
      event.srcElement.classList.remove('move-bar-active')
    }
  }
}
</script>

<style scoped lang="sass">
.left-bar
  height: 100%
  background-color: #a3d2ca
  width: 180px
  min-width: 180px
  float: left
  padding: 0 8px

  .search-notes
    margin-top: 3px
  .note-filter-by-category
    margin-top: 4px
  .directory-tree-view
    margin-top: 5px
    height: calc(40% - 20px)
    max-height: calc(40% - 20px)
    border-radius: 5px
    background-color: #fff
    overflow: auto
  hr
    margin: 5px 0

.move-bar
  position: absolute
  top: 32px
  left: 180px
  width: 1px
  height: calc(100% - 32px)
  background-color: rgba(0, 0, 0, 0.5)

  &::after
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: -15px
    z-index: 1
    pointer-events: auto
    width: 31px
    content: ''
    background-color: transparent
    cursor: ew-resize

.move-bar-active
  &::after
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: -350px
    z-index: 1
    pointer-events: auto
    width: 701px
    content: ''
    background-color: transparent
    cursor: ew-resize
</style>
