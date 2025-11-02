import React from 'react';
import { View } from '../types';
import { HomeIcon, CogIcon, ArchiveBoxIcon, ChartBarIcon, CalendarDaysIcon, AdjustmentsHorizontalIcon, WifiIcon, ShieldCheckIcon } from './Icons';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
}

const navItems = [
    { view: 'home', label: 'Home', Icon: HomeIcon },
    { view: 'platforms', label: 'Platforms', Icon: CogIcon },
    { view: 'exports', label: 'Exports', Icon: ArchiveBoxIcon },
    { view: 'analysis', label: 'Analysis', Icon: ChartBarIcon },
    { view: 'schedules', label: 'Schedules', Icon: CalendarDaysIcon },
    { view: 'settings', label: 'Settings', Icon: AdjustmentsHorizontalIcon },
    { view: 'status', label: 'Status', Icon: WifiIcon },
] as const;


const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
    return (
        <aside className="w-64 bg-gray-800/50 rounded-2xl p-4 flex flex-col border border-gray-700 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2 mb-8 px-2">
                <ShieldCheckIcon className="w-8 h-8 text-cyan-400" />
                <h1 className="text-xl font-bold text-white">AI Archivist</h1>
            </div>
            <nav className="flex-1 space-y-2">
                {navItems.map(({ view, label, Icon }) => (
                    <button
                        key={view}
                        onClick={() => setView(view)}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                            ${currentView === view
                                ? 'bg-cyan-500/15 text-cyan-300'
                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            }
                        `}
                    >
                        <Icon className="w-6 h-6" />
                        <span className="font-semibold">{label}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-auto p-3 bg-gray-900/50 rounded-lg text-center text-xs text-gray-400">
                <p className="font-semibold text-green-400 mb-1">Status: All Systems Normal</p>
                <p>Registry Version: 2025.08.27</p>
            </div>
        </aside>
    );
};

export default Sidebar;
