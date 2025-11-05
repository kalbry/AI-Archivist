import React, { useState, useEffect } from 'react';
import { Platform, ExportFormat, JobStatus, LogEntry, PlatformProgress } from '@/types';
import { JsonIcon, DocumentIcon, ZipIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon } from './Icons';
import ProgressBar from './ProgressBar';
import LogViewer from './LogViewer';

interface WizardProps {
    isOpen: boolean;
    onClose: () => void;
    onStartRun: () => void;
    platforms: Platform[];
    formats: Set<ExportFormat>;
    onToggleFormat: (format: ExportFormat) => void;
    jobStatus: JobStatus;
    logs: LogEntry[];
    progress: PlatformProgress;
}

const Step1: React.FC<{ platforms: Platform[]; onNext: () => void; }> = ({ platforms, onNext }) => (
    <div>
        <h3 className="text-xl font-semibold mb-2">Confirm Scope</h3>
        <p className="text-gray-400 mb-6">The following platforms will be archived in this run:</p>
        <ul className="space-y-3 mb-8">
            {platforms.map(p => (
                <li key={p.id} className="bg-gray-700/50 p-3 rounded-lg flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                    <span className="font-medium">{p.name}</span>
                    <span className="ml-auto text-sm text-gray-400">{p.conversationCount} conversations</span>
                </li>
            ))}
        </ul>
        <div className="flex justify-end">
            <button onClick={onNext} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2">
                Next <ArrowRightIcon className="w-4 h-4" />
            </button>
        </div>
    </div>
);

const Step2: React.FC<{
    formats: Set<ExportFormat>;
    onToggleFormat: (format: ExportFormat) => void;
    formatOptions: { format: ExportFormat, Icon: React.FC<any>, description: string }[];
    onBack: () => void;
    onRun: () => void;
}> = ({ formats, onToggleFormat, formatOptions, onBack, onRun }) => (
     <div>
        <h3 className="text-xl font-semibold mb-2">Select Output Formats</h3>
        <p className="text-gray-400 mb-6">Choose one or more formats for your archive export.</p>
        <div className="space-y-3 mb-8">
            {formatOptions.map(({ format, Icon, description }) => (
                <div key={format} onClick={() => onToggleFormat(format)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${formats.has(format) ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'}`}>
                    <div className="flex items-center">
                        <Icon className="w-6 h-6 text-cyan-300 mr-4"/>
                        <div>
                            <p className="font-semibold">{format}</p>
                            <p className="text-sm text-gray-400">{description}</p>
                        </div>
                        {formats.has(format) && <CheckCircleIcon className="w-6 h-6 text-cyan-400 ml-auto" />}
                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-between">
            <button onClick={onBack} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg">Back</button>
            <button onClick={onRun} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg">Start Archiving</button>
        </div>
    </div>
);

const Step3: React.FC<{
    jobStatus: JobStatus;
    logs: LogEntry[];
    progress: PlatformProgress;
    platforms: Platform[];
    onClose: () => void;
}> = ({ jobStatus, logs, progress, platforms, onClose }) => (
    <div>
        <h3 className="text-xl font-semibold mb-4 text-center">
            {jobStatus === JobStatus.Running && 'Archiving in Progress...'}
            {jobStatus === JobStatus.Completed && <span className="flex items-center justify-center gap-2 text-green-400"><CheckCircleIcon className="w-6 h-6" /> Archive Complete!</span>}
            {jobStatus === JobStatus.Failed && <span className="flex items-center justify-center gap-2 text-red-400"><XCircleIcon className="w-6 h-6" /> Archive Failed</span>}
        </h3>
        
        <div className="space-y-4 mb-6">
            {platforms.map(p => (
                <div key={p.id}>
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-300">{p.name}</span>
                        <span className="text-sm text-gray-400">{progress[p.id]?.message || 'Waiting...'}</span>
                    </div>
                    <ProgressBar percent={progress[p.id]?.percent || 0} />
                </div>
            ))}
        </div>

        <LogViewer logs={logs} />

        {(jobStatus === JobStatus.Completed || jobStatus === JobStatus.Failed) && (
            <div className="mt-8 text-center">
                <button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-8 rounded-lg">
                    Finish
                </button>
            </div>
        )}
    </div>
);

const Wizard: React.FC<WizardProps> = ({
    isOpen, onClose, onStartRun, platforms, formats, onToggleFormat, jobStatus, logs, progress
}) => {
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (jobStatus === JobStatus.Running || jobStatus === JobStatus.Completed || jobStatus === JobStatus.Failed) {
            setStep(3);
        } else if (isOpen) { // Reset to step 1 when opening and not already running
            setStep(1);
        }
    }, [jobStatus, isOpen]);

    if (!isOpen) return null;

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);
    const handleRun = () => {
        onStartRun();
        setStep(3);
    }
    
    const formatOptions = [
        { format: ExportFormat.Markdown, Icon: DocumentIcon, description: "One .md file per conversation." },
        { format: ExportFormat.JSONL, Icon: JsonIcon, description: "Raw data for developers." },
        { format: ExportFormat.ZIP, Icon: ZipIcon, description: "All files in a single bundle." },
    ];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <header className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">New Archive Run</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none font-bold">&times;</button>
                </header>
                
                <div className="p-8 flex-grow overflow-y-auto">
                    {step === 1 && <Step1 platforms={platforms} onNext={handleNext} />}
                    {step === 2 && <Step2 formats={formats} onToggleFormat={onToggleFormat} formatOptions={formatOptions} onBack={handleBack} onRun={handleRun} />}
                    {step === 3 && <Step3 jobStatus={jobStatus} logs={logs} progress={progress} platforms={platforms} onClose={onClose} />}
                </div>
            </div>
        </div>
    );
};

export default Wizard;