export enum PlatformStatus {
    Ready = 'Ready',
    NeedsLogin = 'Needs Login',
    Outdated = 'Outdated',
    Blocked = 'Blocked',
    Updating = 'Updating',
}

export enum AdapterStatus {
    UpToDate = 'Up to Date',
    UpdateAvailable = 'Update Available',
    Updating = 'Updating',
}

export interface Adapter {
    version: string;
    status: AdapterStatus;
}

export interface Platform {
    id: string;
    name: string;
    status: PlatformStatus;
    conversationCount: number;
    adapter: Adapter;
}

export enum ExportFormat {
    Markdown = "Markdown (.md)",
    JSONL = "JSONL (.jsonl)",
    ZIP = "ZIP (.zip)",
}

export enum JobStatus {
    Idle = 'Idle',
    Running = 'Running',
    Completed = 'Completed',
    Failed = 'Failed',
}

export enum LogLevel {
    Info = 'INFO',
    Warn = 'WARN',
    Error = 'ERROR',
    Success = 'SUCCESS',
}

export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    platformId?: string;
}

export interface PlatformProgress {
    [platformId: string]: {
        percent: number;
        message: string;
    };
}

export interface Settings {
    vaultEncryption: boolean;
    telemetry: boolean;
}
