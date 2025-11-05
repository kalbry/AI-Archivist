const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');
// Note: Store is no longer required here. It will be imported asynchronously.
const { runArchiveJob } = require('./electron/archiver');
const { initDatabase } = require('./electron/database');

let mainWindow;
let store; // Will be initialized asynchronously

async function initializeStore() {
  const { default: Store } = await import('electron-store');
  store = new Store({
    defaults: {
      settings: {
        vaultEncryption: false,
        telemetry: true,
      }
    }
  });
}

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
    backgroundColor: '#111827',
    icon: path.join(__dirname, 'assets/icon.png')
  });
  
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist/index.html')}`;
  mainWindow.loadURL(startUrl);

  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }
}

const menuTemplate = [
  ...(process.platform === 'darwin' ? [{
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://github.com/aistudio/ai-archivist');
        }
      },
      {
        label: 'About AI Archivist',
        click: () => {
            app.showAboutPanel();
        }
      }
    ]
  }
];

// Use an async function for the 'whenReady' promise
app.whenReady().then(async () => {
  // Initialize the store before doing anything else
  await initializeStore();

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Set 'About' panel options
  const packageJson = require('./package.json');
  app.setAboutPanelOptions({
      applicationName: "AI Archivist",
      applicationVersion: packageJson.version,
      copyright: `Copyright © 2024 ${packageJson.author}`,
      authors: [packageJson.author],
      website: packageJson.homepage,
      iconPath: path.join(__dirname, 'assets/icon.png'),
  });

  initDatabase();
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
ipcMain.handle('start-archive-run', async (event, args) => {
  runArchiveJob({ ...args, webContents: event.sender });
});

ipcMain.handle('get-settings', async () => {
  return store.get('settings');
});

ipcMain.on('save-settings', (event, settings) => {
  store.set('settings', settings);
});