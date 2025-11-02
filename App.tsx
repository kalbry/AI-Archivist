import React, { useState, useEffect, useCallback } from 'react';
import { Platform, PlatformStatus, AdapterStatus, ExportFormat, JobStatus, LogEntry, PlatformProgress, Settings } from './types';
import Sidebar, { View } from './components/Sidebar';
import PlatformTile from './components/PlatformTile';
import AdaptersView from './components/AdaptersView';
import SettingsView from './components/SettingsView';
import DocsView from './components/DocsView';
import Wizard from './components/Wizard';
import { ipcApi } from './ipcApi';

const initialPlatforms: Platform[] = [
    { id: 'chatgpt', name: 'ChatGPT', status: PlatformStatus.Ready, conversationCount: 248, adapter: { version: '1.2.3', status: AdapterStatus.UpToDate } },
    { id: 'claude', name: 'Claude', status: PlatformStatus.NeedsLogin, conversationCount: 102, adapter: { version: '0.9.1', status: AdapterStatus.UpToDate } },
    { id: 'gemini', name: 'Gemini', status: PlatformStatus.Ready, conversationCount: 56, adapter: { version: '1.1.0', status: AdapterStatus.UpdateAvailable } },
    { id: 'perplexity', name: 'Perplexity', status: PlatformStatus.Outdated, conversationCount: 12, adapter: { version: '0.5.0', status: AdapterStatus.UpToDate } },
    { id: 'poe', name: 'Poe', status: PlatformStatus.Blocked, conversationCount: 88, adapter: { version: '1.0.0', status: AdapterStatus.UpToDate } },
];

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
    const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
    const [isWizardOpen, setWizardOpen] = useState(false);
    const [jobStatus, setJobStatus] = useState<JobStatus>(JobStatus.Idle);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [progress, setProgress] = useState<PlatformProgress>({});
    const [formats, setFormats] = useState<Set<ExportFormat>>(new Set([ExportFormat.Markdown]));
    const [settings, setSettings] = useState<Settings>({ vaultEncryption: false, telemetry: true });

    useEffect(() => {
        // Fetch initial settings from main process
        ipcApi.getSettings().then(setSettings);
        
        // Setup listeners
        ipcApi.onLogEntry((log) => setLogs(prev => [...prev, log]));
        ipcApi.onProgressUpdate((p) => {
            setProgress(prev => ({ ...prev, [p.platformId]: { percent: p.percent, message: p.message } }));
        });
        ipcApi.onJobCompletion((result) => {
            setJobStatus(result.status as JobStatus);
        });

        // Cleanup on unmount
        return () => ipcApi.cleanup();
    }, []);

    const handleSelectPlatform = (platformId: string) => {
        setSelectedPlatforms(prev => {
            const newSet = new Set(prev);
            if (newSet.has(platformId)) {
                newSet.delete(platformId);
            } else {
                newSet.add(platformId);
            }
            return newSet;
        });
    };
    
    const handleUpdateAdapter = (platformId: string) => {
        setPlatforms(prev => prev.map(p =>
            p.id === platformId ? { ...p, adapter: { ...p.adapter, status: AdapterStatus.Updating } } : p
        ));
        setTimeout(() => {
             setPlatforms(prev => prev.map(p =>
                p.id === platformId ? { ...p, adapter: { version: '1.2.0', status: AdapterStatus.UpToDate } } : p
            ));
        }, 2000);
    };

    const handleSettingsChange = (newSettings: Settings) => {
        setSettings(newSettings);
        ipcApi.saveSettings(newSettings);
    };

    const handleOpenWizard = () => {
        if (getRunnablePlatforms().length > 0) {
            setWizardOpen(true);
        }
    };
    
    const handleStartRun = () => {
        const runnablePlatforms = getRunnablePlatforms();
        setJobStatus(JobStatus.Running);
        setProgress({});
        setLogs([]);
        ipcApi.startArchiveRun({ 
            platforms: runnablePlatforms,
            formats: Array.from(formats)
        });
    };

    const handleCloseWizard = () => {
        setWizardOpen(false);
        if (jobStatus === JobStatus.Completed || jobStatus === JobStatus.Failed) {
            setJobStatus(JobStatus.Idle);
            setSelectedPlatforms(new Set());
        }
    }

    const handleToggleFormat = (format: ExportFormat) => {
        setFormats(prev => {
            const newSet = new Set(prev);
            if (newSet.has(format)) {
                newSet.delete(format);
            } else {
                newSet.add(format);
            }
            return newSet;
        });
    };

    const getRunnablePlatforms = useCallback(() => {
        return platforms.filter(p => selectedPlatforms.has(p.id) && p.status === PlatformStatus.Ready);
    }, [platforms, selectedPlatforms]);

    const renderView = () => {
        switch (view) {
            case 'adapters':
                return <AdaptersView platforms={platforms} onUpdateAdapter={handleUpdateAdapter} />;
            case 'settings':
                return <SettingsView settings={settings} onSettingsChange={handleSettingsChange} />;
            case 'docs':
                return <DocsView />;
            case 'dashboard':
            default:
                const runnableCount = getRunnablePlatforms().length;
                return (
                    <div>
                        <header className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                                <p className="text-gray-400">Select platforms to begin an archive run.</p>
                            </div>
                            <button 
                                onClick={handleOpenWizard} 
                                disabled={runnableCount === 0}
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                            >
                                Start New Archive Run ({runnableCount} selected)
                            </button>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {platforms.map(p => (
                                <PlatformTile
                                    key={p.id}
                                    platform={p}
                                    isSelected={selectedPlatforms.has(p.id)}
                                    onSelect={() => handleSelectPlatform(p.id)}
                                />
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen flex font-sans">
            <Sidebar currentView={view} onViewChange={setView} />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderView()}
            </main>
            <Wizard
                isOpen={isWizardOpen}
                onClose={handleCloseWizard}
                onStartRun={handleStartRun}
                platforms={getRunnablePlatforms()}
                formats={formats}
                onToggleFormat={handleToggleFormat}
                jobStatus={jobStatus}
                logs={logs}
                progress={progress}
            />
        </div>
    );
};

export default App;
