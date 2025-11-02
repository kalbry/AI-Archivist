const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { runArchiveJob } = require('./electron/archiver');
const { initDatabase } = require('./electron/database');

// --- Mock settings store ---
const Store = require('electron-store');
const store = new Store({
  defaults: {
    settings: {
      vaultEncryption: false,
      telemetry: true,
    }
  }
});
// -------------------------

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 940,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 15 },
    backgroundColor: '#111827', // dark gray background
  });

  // In production, load the built React app
  // In development, load the React dev server
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  initDatabase(); // Initialize the database on startup
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- IPC Handlers ---

// This is an async handler because the job itself is async
ipcMain.handle('start-archive-run', async (event, args) => {
  console.log('IPC: Received start-archive-run', args);
  // The archiver function needs webContents to send back progress updates
  runArchiveJob({ ...args, webContents: event.sender });
});

ipcMain.handle('get-settings', async (event) => {
  console.log('IPC: Received get-settings');
  return store.get('settings');
});

ipcMain.on('save-settings', (event, settings) => {
  console.log('IPC: Received save-settings', settings);
  store.set('settings', settings);
});
