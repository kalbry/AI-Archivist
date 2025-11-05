import React, { useState, useEffect, useCallback } from 'react';
import { Platform, PlatformStatus, AdapterStatus, ExportFormat, JobStatus, LogEntry, PlatformProgress, Settings } from './types';
import Sidebar, { View } from './components/Sidebar';
import PlatformTile from './components/PlatformTile';
import AdaptersView from './components/AdaptersView';
import SettingsView from './components/SettingsView';
import DocsView from './components/DocsView';
import Wizard from './components/Wizard';
import { Button } from './components/ui/Button';
import { cn } from './lib/utils';
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
                    <div className="animate-fade-in">
                        <header className="flex justify-between items-center mb-8">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                                <p className="text-surface-400">Select platforms to begin an archive run</p>
                            </div>
                            <Button
                                onClick={handleOpenWizard}
                                disabled={runnableCount === 0}
                                size="lg"
                                className={cn(
                                    "relative overflow-hidden",
                                    "before:absolute before:inset-0 before:-translate-x-full",
                                    "before:animate-[shimmer_2s_infinite]",
                                    "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent"
                                )}
                            >
                                Start New Archive Run ({runnableCount} selected)
                            </Button>
                        </header>
                        <div 
                            className={cn(
                                "grid gap-6 animate-slide-up",
                                "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                                "[--animation-delay:200ms] [animation-fill-mode:both]"
                            )}
                        >
                            {platforms.map((p, index) => (
                                <div 
                                    key={p.id}
                                    className={cn(
                                        "animate-slide-up",
                                        `[--animation-delay:${(index + 1) * 100}ms]`,
                                        "[animation-fill-mode:both]"
                                    )}
                                >
                                    <PlatformTile
                                        platform={p}
                                        isSelected={selectedPlatforms.has(p.id)}
                                        onSelect={() => handleSelectPlatform(p.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={cn(
            "min-h-screen font-sans antialiased",
            "bg-gradient-to-b from-gray-900 to-gray-950",
            "text-gray-200 relative overflow-hidden"
        )}>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="relative flex min-h-screen">
                <Sidebar currentView={view} onViewChange={setView} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="container mx-auto max-w-7xl">
                        {renderView()}
                    </div>
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
        </div>
    );
};

export default App;
