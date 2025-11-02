
export enum PlatformStatus {
    Ready = 'Ready',
    NeedsLogin = 'Needs Login',
    Outdated = 'Outdated Adapter',
    Blocked = 'Blocked',
    Updating = 'Updating Adapter',
}

export enum AdapterStatus {
    UpToDate = 'Up to date',
    UpdateAvailable = 'Update available',
    Updating = 'Updating...',
}

export interface Platform {
    id: string;
    name: string;
    status: PlatformStatus;
    conversationCount: number;
    lastRun?: Date;
    adapter: {
        version: string;
        status: AdapterStatus;
        lastChecked: Date;
    };
}

export enum ExportFormat {
    JSONL = 'JSONL',
    Markdown = 'Markdown',
    ZIP = 'ZIP Bundle',
}

export enum JobStatus {
    Idle = 'Idle',
    Configuring = 'Configuring',
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

export type View = 'home' | 'platforms' | 'exports' | 'analysis' | 'schedules' | 'settings' | 'status';