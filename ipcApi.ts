import { Settings, LogEntry, Platform, ExportFormat } from "./types";
import { runArchiveJob } from './services/archiverService';

// This exposes the functions from preload.js to the rest of the renderer process
// in a type-safe way.
interface ElectronAPI {
    startArchiveRun: (args: { platforms: Platform[], formats: ExportFormat[] }) => Promise<void>;
    getSettings: () => Promise<Settings>;
    saveSettings: (settings: Settings) => void;
    onLogEntry: (callback: (log: LogEntry) => void) => void;
    onProgressUpdate: (callback: (progress: any) => void) => void;
    onJobCompletion: (callback: (result: { status: string }) => void) => void;
    cleanup: () => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

// --- MOCK API for Preview Environments ---
const createMockApi = (): ElectronAPI => {
    console.warn("Electron API not found. Using mock implementation for preview.");

    const listeners: {
        log: ((log: LogEntry) => void) | null,
        progress: ((progress: any) => void) | null,
        completion: ((result: { status: string; }) => void) | null,
    } = {
        log: null,
        progress: null,
        completion: null,
    };

    return {
        startArchiveRun: async ({ platforms, formats }) => {
            console.log("MOCK: Starting archive run", { platforms, formats });
            // Use the original simulation service
            runArchiveJob({
                platforms,
                formats,
                onLog: (log) => listeners.log?.(log),
                onProgress: (platformId, percent, message) => listeners.progress?.({ platformId, percent, message }),
                onComplete: () => listeners.completion?.({ status: 'Completed' }),
                onError: () => listeners.completion?.({ status: 'Failed' }),
            });
        },
        getSettings: async () => {
            console.log("MOCK: Getting settings");
            return { vaultEncryption: false, telemetry: true }; // Return some default settings
        },
        saveSettings: (settings: Settings) => {
            console.log("MOCK: Saving settings", settings);
            // In a real app, this might use localStorage for mock persistence
        },
        onLogEntry: (callback) => {
            listeners.log = callback;
        },
        onProgressUpdate: (callback) => {
            listeners.progress = callback;
        },
        onJobCompletion: (callback) => {
            listeners.completion = callback;
        },
        cleanup: () => {
            listeners.log = null;
            listeners.progress = null;
            listeners.completion = null;
            console.log("MOCK: Cleaned up listeners");
        }
    };
};

// Use the real Electron API if it's available, otherwise use the mock
export const ipcApi = window.electronAPI || createMockApi();
