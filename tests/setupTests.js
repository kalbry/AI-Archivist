// Jest setup file
require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');

// Polyfill for browser globals
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.setImmediate = require('timers').setImmediate;

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
    writable: true,
    configurable: true
});

// Mock Electron modules
jest.mock('electron', () => ({
    ipcMain: mockIpcMain,
    app: {
        getPath: jest.fn(() => '/mock/path'),
    },
}));

// Mock browser context for Playwright tests
jest.mock('playwright', () => ({
    chromium: {
        launch: jest.fn().mockResolvedValue({
            newContext: jest.fn().mockResolvedValue({
                newPage: jest.fn().mockResolvedValue({
                    goto: jest.fn(),
                    close: jest.fn()
                }),
                close: jest.fn()
            }),
            close: jest.fn()
        })
    }
}));

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});