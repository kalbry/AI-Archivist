// Jest setup file
require('@testing-library/jest-dom');

// Mock Electron IPC
const mockIpcRenderer = {
    on: jest.fn(),
    send: jest.fn(),
    invoke: jest.fn(),
};

const mockIpcMain = {
    on: jest.fn(),
    handle: jest.fn(),
};

// Mock window.electron
Object.defineProperty(window, 'electron', {
    value: {
        ipcRenderer: mockIpcRenderer,
    },
});

// Mock Electron modules
jest.mock('electron', () => ({
    ipcMain: mockIpcMain,
    app: {
        getPath: jest.fn(() => '/mock/path'),
    },
}));

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});