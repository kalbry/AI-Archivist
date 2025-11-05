import React, { useState, useEffect, useCallback } from 'react';
import { Platform, PlatformStatus, AdapterStatus, ExportFormat, JobStatus, LogEntry, PlatformProgress, Settings } from './types';
import Sidebar, { View } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AdaptersView from './components/AdaptersView';
import SettingsView from './components/SettingsView';
import DocsView from './components/DocsView';
import Wizard from './components/Wizard';
import { ipcApi } from './ipcApi';

const initialPlatforms: Platform[] = [
    { id: 'chatgpt', name: 'ChatGPT', status: PlatformStatus.Ready, conversationCount: 128, adapter: { version: '1.2.3', status: AdapterStatus.UpToDate } },
    { id: 'claude', name: 'Claude', status: PlatformStatus.NeedsLogin, conversationCount: 42, adapter: { version: '1.1.0', status: AdapterStatus.UpToDate } },
    { id: 'gemini', name: 'Gemini', status: PlatformStatus.Ready, conversationCount: 310, adapter: { version: '1.4.0', status: AdapterStatus.UpdateAvailable } },
    { id: 'perplexity', name: 'Perplexity', status: PlatformStatus.Outdated, conversationCount: 15, adapter: { version: '0.9.5', status: AdapterStatus.UpToDate } },
    { id: 'poe', name: 'Poe', status: PlatformStatus.Ready, conversationCount: 76, adapter: { version: '1.0.0', status: AdapterStatus.UpToDate } },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [isWizardOpen, setWizardOpen] = useState(false);
  const [exportFormats, setExportFormats] = useState<Set<ExportFormat>>(new Set([ExportFormat.Markdown]));
  const [jobStatus, setJobStatus] = useState<JobStatus>(JobStatus.Idle);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState<PlatformProgress>({});
  const [settings, setSettings] = useState<Settings>({ vaultEncryption: false, telemetry: true });

  useEffect(() => {
    const fetchSettings = async () => {
      const fetchedSettings = await ipcApi.getSettings();
      setSettings(fetchedSettings);
    };
    fetchSettings();
  }, []);

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
    ipcApi.saveSettings(newSettings);
  };
  
  const handleTogglePlatform = (platformId: string) => {
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

  const handleToggleFormat = (format: ExportFormat) => {
    setExportFormats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(format)) {
        newSet.delete(format);
      } else {
        newSet.add(format);
      }
      return newSet;
    });
  };

  const openWizard = () => {
    if (selectedPlatforms.size > 0) {
      setJobStatus(JobStatus.Idle);
      setLogs([]);
      setProgress({});
      setWizardOpen(true);
    }
  };

  const closeWizard = () => {
    setWizardOpen(false);
    // Potentially reset job state here if desired
    if (jobStatus === JobStatus.Completed || jobStatus === JobStatus.Failed) {
      setJobStatus(JobStatus.Idle);
    }
  };

  const handleStartRun = useCallback(() => {
    const platformsToRun = platforms.filter(p => selectedPlatforms.has(p.id));
    
    setJobStatus(JobStatus.Running);
    setLogs([]);
    setProgress(
      platformsToRun.reduce((acc, p) => ({ ...acc, [p.id]: { percent: 0, message: 'Starting...' } }), {})
    );

    ipcApi.startArchiveRun({
      platforms: platformsToRun,
      formats: Array.from(exportFormats),
    });
  }, [platforms, selectedPlatforms, exportFormats]);

  useEffect(() => {
    if (jobStatus === JobStatus.Running) {
      const handleLog = (log: LogEntry) => setLogs(prev => [...prev, log]);
      const handleProgress = (p: { platformId: string, percent: number, message: string }) => {
        setProgress(prev => ({
          ...prev,
          [p.platformId]: { percent: p.percent, message: p.message }
        }));
      };
      const handleCompletion = ({ status }: { status: 'Completed' | 'Failed' }) => {
        setJobStatus(status === 'Completed' ? JobStatus.Completed : JobStatus.Failed);
      };

      ipcApi.onLogEntry(handleLog);
      ipcApi.onProgressUpdate(handleProgress);
      ipcApi.onJobCompletion(handleCompletion);

      return () => ipcApi.cleanup();
    }
  }, [jobStatus]);

  const handleUpdateAdapter = (platformId: string) => {
    const update = (status: AdapterStatus) => {
      setPlatforms(prev => prev.map(p => p.id === platformId ? { ...p, adapter: { ...p.adapter, status } } : p));
    };

    update(AdapterStatus.Updating);
    setTimeout(() => {
      update(AdapterStatus.UpToDate);
    }, 2000 + Math.random() * 1000);
  };
  
  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard 
                  platforms={platforms} 
                  selectedPlatforms={selectedPlatforms}
                  onTogglePlatform={handleTogglePlatform}
                  onStartRun={openWizard}
                />;
      case 'adapters':
        return <AdaptersView platforms={platforms} onUpdateAdapter={handleUpdateAdapter} />;
      case 'settings':
        return <SettingsView settings={settings} onSettingsChange={handleSettingsChange} />;
      case 'docs':
        return <DocsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-surface-950 text-white font-sans overflow-hidden">
      <div 
        className="fixed inset-0 bg-gradient-to-br from-surface-900 to-surface-950 -z-10"
        style={{ backgroundImage: 'url(/grid.svg), linear-gradient(to bottom right, var(--color-surface-900), var(--color-surface-950))' }}
      />
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-y-auto p-8 animate-fade-in animate-slide-up">
        <div className="w-full max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
      <Wizard
        isOpen={isWizardOpen}
        onClose={closeWizard}
        onStartRun={handleStartRun}
        platforms={platforms.filter(p => selectedPlatforms.has(p.id))}
        formats={exportFormats}
        onToggleFormat={handleToggleFormat}
        jobStatus={jobStatus}
        logs={logs}
        progress={progress}
      />
    </div>
  );
};

export default App;