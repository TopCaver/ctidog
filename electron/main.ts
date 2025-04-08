import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fetch from 'node-fetch'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))


// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

ipcMain.handle('fetch-intel', async (event, query) => {
  // This is where you would fetch data from an API or perform some other action
  // For demonstration purposes, we'll just return a simple message
  console.log('Received query:', query)
  const mockData = [
    { source: 'VirusTotal', level: '高', detail: '检测为恶意 IP' },
    { source: 'AlienVault', level: '中', detail: '可疑活动' },
    { source: 'AbuseIPDB', level: '低', detail: '历史记录为空' },
  ]
  return { summary: '该地址存在恶意行为，建议拦截。', results: mockData };
});

ipcMain.handle('query-nti-ip', async(_event,ip:string, apiKey:string) => {
  try {
    console.log('NTI 查询 IP：', ip, 'API Key：', apiKey);
    const res = await fetch(`https://nti.nsfocus.com/api/v2/objects/ioc-ipv4/?query=${ip}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/nsfocus.nti.spec+json; version=2.0',
        'X-Ns-Nti-Key': apiKey,
        'Accept-Encoding': 'gzip'
      }
    });
    
    const data = await res.json();
    console.log('NTI 查询结果：', data);
    return { success: true, data };
  } catch (err) {
    console.error('NTI 查询失败：', err);
    return { success: false, message: 'NTI 查询失败' };
  }
});

ipcMain.handle('query-vt-ip', async (_event, ip: string, apiKey: string) => {
  try {
    const res = await fetch(`https://www.virustotal.com/api/v3/ip_addresses/${encodeURIComponent(ip)}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-apikey': apiKey
      }
    });
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error('VT 查询失败：', err);
    return { success: false, message: 'VT 查询失败' };
  }
});

ipcMain.handle('query-kaspersky-ip', async (_event, ip: string, apiKey: string) => {
  try {
    const url = `https://opentip.kaspersky.com/api/v1/search/ip?request=${encodeURIComponent(ip)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    });
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error('Kaspersky 查询失败：', err);
    return { success: false, message: 'Kaspersky 查询失败' };
  }
});