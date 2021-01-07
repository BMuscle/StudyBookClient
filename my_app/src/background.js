'use strict'
import { app, protocol, BrowserWindow, shell, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 誰かが2つ目のインスタンスを実行したとき、このウィンドウにフォーカスする
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 400,
    minWidth: 500,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      webSecurity: false,
      devTools: isDevelopment,
      nodeIntegrationInWorker: true
    },
    icon: path.join(__static, 'icon.ico')
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app') // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  win.on('closed', () => {
    win = null
  }) // URLをクリックしたときに既定のブラウザで開くようにする
  const handleUrlOpen = (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  }
  win.webContents.on('will-navigate', handleUrlOpen)
  win.webContents.on('new-window', handleUrlOpen)
  if (!isDevelopment) {
    win.webContents.reload = () => {}
    win.webContents.reloadIgnoringCache = () => {}
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension({
        id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
        electron: '>=1.2.1'
      })
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  initWindowMenu()
  createWindow()
})
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

function initWindowMenu() {
  const template = [
    {
      label: 'ファイル',
      submenu: [
        {
          label: '終了',
          click() { app.quit() }
        }
      ],
    },
    {
      label: 'ヘルプ',
      submenu: [
        {
          label: 'マニュアル',
          click() { shell.openExternal('http://bgmuscle.ddns.net/information/manual') }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
