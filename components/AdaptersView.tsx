import React from 'react';
import { Platform, AdapterStatus } from '../types';
import { PLATFORM_LOGOS, CheckCircleIcon, ClockIcon, SpinnerIcon, ShieldCheckIcon } from './Icons';

interface AdaptersViewProps {
    platforms: Platform[];
    onUpdateAdapter: (platformId: string) => void;
}

const statusConfig = {
    [AdapterStatus.UpToDate]: {
        Icon: CheckCircleIcon,
        color: 'text-green-400',
        actionText: 'Up to Date',
        disabled: true,
    },
    [AdapterStatus.UpdateAvailable]: {
        Icon: ClockIcon,
        color: 'text-orange-400',
        actionText: 'Update Now',
        disabled: false,
    },
    [AdapterStatus.Updating]: {
        Icon: SpinnerIcon,
        color: 'text-cyan-400',
        actionText: 'Updating...',
        disabled: true,
    }
};

const AdaptersView: React.FC<AdaptersViewProps> = ({ platforms, onUpdateAdapter }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-2xl shadow-black/20">
            <header className="mb-6">
                 <h2 className="text-2xl font-semibold mb-1">Platforms & Adapters</h2>
                 <p className="text-gray-400">Manage connection status and update platform adapters from the signed selector registry.</p>
            </header>
            
            <div className="space-y-3">
                {platforms.map(platform => {
                    const { Icon, color, actionText, disabled } = statusConfig[platform.adapter.status];
                    const isUpdating = platform.adapter.status === AdapterStatus.Updating;

                    return (
                        <div key={platform.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center gap-4 flex-wrap">
                            <div className="w-8 h-8 flex-shrink-0">{PLATFORM_LOGOS[platform.id]}</div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg">{platform.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span>Version: {platform.adapter.version}</span>
                                    <div className="flex items-center gap-1 text-green-400" title="Selector registry signature is valid">
                                        <ShieldCheckIcon className="w-4 h-4" />
                                        <span>Verified</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 ml-auto">
                                <div className={`flex items-center text-sm ${color}`}>
                                    <Icon className={`w-5 h-5 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                                    <span>{platform.adapter.status}</span>
                                </div>
                                <button
                                    onClick={() => onUpdateAdapter(platform.id)}
                                    disabled={disabled}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-32 text-center"
                                >
                                    {actionText}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
             <footer className="text-center mt-6 text-gray-500 text-xs">
                <p>Adapters are updated from a remote, cryptographically-signed registry to ensure integrity.</p>
            </footer>
        </div>
    );
};

export default AdaptersView;