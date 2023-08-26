import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  Menu.setApplicationMenu(null)
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    // frame: false,
    // transparent: true, // 透明窗口
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#fff', // 背景色
    //   symbolColor: '#000',
    //   height: 30
    // },
    // title: '智星AI数字人',
    title: '安馨康达',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

// 直播窗口
let liveWin = null
ipcMain.on('open-win', (_, parame) => { // 主进程打开新窗口
  const { width, height, path } = parame
  liveWin = new BrowserWindow({
    // parent: win,
    title: '直播窗口',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    width,
    height,
    minimizable: false, // 是否可以最小化
    maximizable: false, // 是否可以最小化
    closable: true, // 窗口是否可关闭
    alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    // frame: false,
    // titleBarStyle: 'hidden',
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  if (process.env.VITE_DEV_SERVER_URL) {
    liveWin.loadURL(`${url}#${path}`)
    liveWin.webContents.openDevTools()
  } else {
    liveWin.loadFile(indexHtml, { hash: path })
  }
  // 直播窗口关闭
  liveWin.on('close', () => {
    win.webContents.send('liveClose')
  });
})

ipcMain.on('play-live', (_, liveInfo) => {
  //给live窗体渲染进程发消息
  if(liveWin) liveWin.webContents.send('play-live', liveInfo)
})

// ipcMain.on('change-volume', (_, parame) => {
//   if(liveWin) liveWin.webContents.send('change-volume', parame)
// })

// ipcMain.on('welcome', (_, url) => {
//   if(liveWin) liveWin.webContents.send('welcome', url)
// })