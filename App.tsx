import React, { useState, useCallback, useMemo } from 'react';
import { Platform, PlatformStatus, ExportFormat, JobStatus, LogEntry, PlatformProgress, AdapterStatus, View } from './types';
import { ShieldCheckIcon, DocumentTextIcon } from './components/Icons';
import PlatformTile from './components/PlatformTile';
import Wizard from './components/Wizard';
import AdaptersView from './components/AdaptersView';
import { runArchiveJob } from './services/archiverService';
import Sidebar from './components/Sidebar';

const INITIAL_PLATFORMS: Platform[] = [
  { id: 'chatgpt', name: 'ChatGPT', status: PlatformStatus.Ready, conversationCount: 152, lastRun: new Date('2023-10-26T10:00:00Z'), adapter: { version: '2025.08.26', status: AdapterStatus.UpToDate, lastChecked: new Date() } },
  { id: 'claude', name: 'Claude', status: PlatformStatus.Ready, conversationCount: 88, lastRun: new Date('2023-10-25T14:30:00Z'), adapter: { version: '2025.08.25', status: AdapterStatus.UpToDate, lastChecked: new Date() } },
  { id: 'gemini', name: 'Gemini', status: PlatformStatus.NeedsLogin, conversationCount: 205, lastRun: new Date('2023-10-22T09:15:00Z'), adapter: { version: '2025.08.27', status: AdapterStatus.UpToDate, lastChecked: new Date() } },
  { id: 'perplexity', name: 'Perplexity', status: PlatformStatus.Outdated, conversationCount: 45, lastRun: new Date('2023-09-01T11:00:00Z'), adapter: { version: '2025.08.21', status: AdapterStatus.UpdateAvailable, lastChecked: new Date() } },
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const PlaceholderView: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
        <DocumentTextIcon className="w-16 h-16 text-gray-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-300">{title}</h2>
        <p className="text-gray-400 mt-2">{description}</p>
    </div>
);


export default function App() {
  const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
  const [view, setView] = useState<View>('home');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [selectedFormats, setSelectedFormats] = useState<Set<ExportFormat>>(() => new Set([ExportFormat.Markdown]));

  const [jobStatus, setJobStatus] = useState<JobStatus>(JobStatus.Idle);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState<PlatformProgress>({});
  
  const handleTogglePlatform = useCallback((platformId: string) => {
    setSelectedPlatforms(prev => {
      const newSet = new Set(prev);
      const platform = platforms.find(p => p.id === platformId);
      if (platform && platform.status === PlatformStatus.Ready) {
        if (newSet.has(platformId)) {
          newSet.delete(platformId);
        } else {
          newSet.add(platformId);
        }
      }
      return newSet;
    });
  }, [platforms]);

  const handleToggleFormat = useCallback((format: ExportFormat) => {
    setSelectedFormats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(format)) {
        if (newSet.size > 1) newSet.delete(format);
      } else {
        newSet.add(format);
      }
      return newSet;
    });
  }, []);

  const handleUpdateAdapter = useCallback(async (platformId: string) => {
    setPlatforms(prev => prev.map(p => p.id === platformId ? { ...p, status: PlatformStatus.Updating, adapter: { ...p.adapter, status: AdapterStatus.Updating } } : p));
    await sleep(2500);
    setPlatforms(prev => prev.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          status: PlatformStatus.Ready,
          adapter: {
            version: '2025.08.27',
            status: AdapterStatus.UpToDate,
            lastChecked: new Date(),
          }
        };
      }
      return p;
    }));
  }, []);
  
  const handleStartRun = useCallback(async () => {
    setLogs([]);
    setProgress({});
    setJobStatus(JobStatus.Running);

    const platformsToRun = platforms.filter(p => selectedPlatforms.has(p.id));
    
    const onLog = (log: LogEntry) => setLogs(prev => [...prev, log]);
    const onProgress = (platformId: string, percent: number, message: string) => {
        setProgress(prev => ({
            ...prev,
            [platformId]: { percent, message }
        }));
    };
    const onComplete = () => setJobStatus(JobStatus.Completed);
    const onError = () => setJobStatus(JobStatus.Failed);

    await runArchiveJob({
      platforms: platformsToRun,
      formats: Array.from(selectedFormats),
      onLog,
      onProgress,
      onComplete,
      onError
    });
  }, [selectedPlatforms, selectedFormats, platforms]);

  const resetWizard = useCallback(() => {
    setIsWizardOpen(false);
    setJobStatus(JobStatus.Idle);
    setLogs([]);
    setProgress({});
  }, []);

  const eligiblePlatforms = useMemo(() => platforms.filter(p => p.status === PlatformStatus.Ready).length > 0, [platforms]);

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-2xl shadow-black/20">
            <h2 className="text-2xl font-semibold mb-1">Dashboard</h2>
            <p className="text-gray-400 mb-6">Select the platforms you want to include in your next archive run.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {platforms.map(platform => (
                <PlatformTile
                  key={platform.id}
                  platform={platform}
                  isSelected={selectedPlatforms.has(platform.id)}
                  onSelect={() => handleTogglePlatform(platform.id)}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsWizardOpen(true)}
                disabled={selectedPlatforms.size === 0 || !eligiblePlatforms}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {selectedPlatforms.size > 0 ? `Start Run (${selectedPlatforms.size} platform${selectedPlatforms.size > 1 ? 's' : ''})` : 'Select a Platform to Start'}
              </button>
              {!eligiblePlatforms && selectedPlatforms.size === 0 && <p className="text-yellow-400 text-sm mt-2">No platforms are ready for archiving. Check their status in the Platforms tab.</p>}
            </div>
          </div>
        );
      case 'platforms':
        return <AdaptersView platforms={platforms} onUpdateAdapter={handleUpdateAdapter} />;
      case 'exports':
          return <PlaceholderView title="Exports" description="View and manage your past archive exports." />;
      case 'analysis':
          return <PlaceholderView title="Analysis" description="Search and analyze content across all your archived conversations. (V2 Feature)" />;
      case 'schedules':
          return <PlaceholderView title="Schedules" description="Configure automatic, scheduled archive runs." />;
      case 'settings':
          return <PlaceholderView title="Settings" description="Manage application settings, storage, and cloud connections." />;
      case 'status':
          return <PlaceholderView title="System Status" description="Check the health of platform connections and the adapter registry." />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex p-4">
      <Sidebar currentView={view} setView={setView} />
      <div className="flex-1 flex flex-col pl-4">
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
                <ShieldCheckIcon className="w-10 h-10 text-cyan-400" />
                <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                AI Archivist
                </h1>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
                Your privacy-first tool to capture, normalize, and preserve AI conversations.
            </p>
        </header>

        <main className="flex-1">
          {renderContent()}
        </main>

        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} AI Archivist. All your data remains local.</p>
        </footer>
      </div>

      {isWizardOpen && (
        <Wizard
          isOpen={isWizardOpen}
          onClose={resetWizard}
          onStartRun={handleStartRun}
          platforms={platforms.filter(p => selectedPlatforms.has(p.id))}
          formats={selectedFormats}
          onToggleFormat={handleToggleFormat}
          jobStatus={jobStatus}
          logs={logs}
          progress={progress}
        />
      )}
    </div>
  );
}