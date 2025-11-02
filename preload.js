const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Functions the renderer can call (Renderer -> Main)
  startArchiveRun: (args) => ipcRenderer.invoke('start-archive-run', args),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),

  // Functions the renderer can listen to (Main -> Renderer)
  onLogEntry: (callback) => ipcRenderer.on('log-entry', (_event, value) => callback(value)),
  onProgressUpdate: (callback) => ipcRenderer.on('progress-update', (_event, value) => callback(value)),
  onJobCompletion: (callback) => ipcRenderer.on('job-completion', (_event, value) => callback(value)),

  // Cleanup listeners
  cleanup: () => {
    ipcRenderer.removeAllListeners('log-entry');
    ipcRenderer.removeAllListeners('progress-update');
    ipcRenderer.removeAllListeners('job-completion');
  }
});
