export default class NoteHeader {
  constructor(title = '', category = '', tags = []) {
    this.title = title
    this.category = category
    this.tags = tags
  }
  get toString() {
    return `title: ${this.title}\ncategory: ${this.category}\ntags: ${this.tags.join(', ')}`
  }
}
