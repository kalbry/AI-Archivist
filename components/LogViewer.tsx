
import React, { useRef, useEffect } from 'react';
import { LogEntry, LogLevel } from '@/types';

interface LogViewerProps {
    logs: LogEntry[];
}

const levelColors: Record<LogLevel, string> = {
    [LogLevel.Info]: 'text-gray-400',
    [LogLevel.Warn]: 'text-yellow-400',
    [LogLevel.Error]: 'text-red-400',
    [LogLevel.Success]: 'text-green-400',
};

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div ref={scrollRef} className="h-64 bg-gray-900/70 rounded-lg p-4 font-mono text-sm overflow-y-auto border border-gray-700">
            {logs.map((log, index) => (
                <div key={index} className="flex">
                    <span className="text-gray-500 mr-3">{log.timestamp.toLocaleTimeString()}</span>
                    <span className={`${levelColors[log.level]} mr-3 font-bold`}>{log.level}</span>
                    <span className="flex-1 whitespace-pre-wrap">{log.platformId && `[${log.platformId}] `}{log.message}</span>
                </div>
            ))}
        </div>
    );
};

export default LogViewer;