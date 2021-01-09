import fs from 'fs'

const fsAsyncForProduct = {
  async access(path) {
    await fs.promises.access(path)
  },
  async stat(path) {
    return await fs.promises.stat(path)
  },
  async readFile(path, options) {
    return await fs.promises.readFile(path, options)
  },
  async writeFile(path, data) {
    await fs.promises.writeFile(path, data)
  },
  async rename(oldPath, newPath) {
    await fs.promises.rename(oldPath, newPath)
  },
  async unlink(path) {
    await fs.promises.unlink(path)
  },
  async mkdir(path) {
    await fs.promises.mkdir(path)
  },
  async readdir(path, options) {
    return await fs.promises.readdir(path, options)
  },
  async rmdir(path, options) {
    await fs.promises.rmdir(path, options)
  }
}

const fsAsyncForDevelopment = {
  async access(path) {
    fs.accessSync(path)
  },
  async stat(path) {
    return fs.statSync(path)
  },
  async readFile(path, options) {
    return fs.readFileSync(path, options)
  },
  async writeFile(path, data) {
    fs.writeFileSync(path, data)
  },
  async rename(oldPath, newPath) {
    fs.renameSync(oldPath, newPath)
  },
  async unlink(path) {
    fs.unlinkSync(path)
  },
  async mkdir(path) {
    fs.mkdirSync(path)
  },
  async readdir(path, options) {
    return fs.readdirSync(path, options)
  },
  async rmdir(path, options) {
    fs.rmdirSync(path, options)
  }
}

const isDevelopment = process.env.NODE_ENV !== 'production'
export default isDevelopment ? fsAsyncForDevelopment : fsAsyncForProduct
