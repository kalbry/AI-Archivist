import React from 'react';
import { Squares2X2Icon, CpuChipIcon, Cog6ToothIcon, BookOpenIcon } from './Icons';

export type View = 'dashboard' | 'adapters' | 'settings' | 'docs';

interface SidebarProps {
    currentView: View;
    onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', Icon: Squares2X2Icon },
        { id: 'adapters', label: 'Adapters', Icon: CpuChipIcon },
        { id: 'settings', label: 'Settings', Icon: Cog6ToothIcon },
        { id: 'docs', label: 'Docs', Icon: BookOpenIcon },
    ];

    const NavLink: React.FC<{
        view: View;
        label: string;
        Icon: React.FC<any>;
    }> = ({ view, label, Icon }) => {
        const isActive = currentView === view;
        return (
            <button
                onClick={() => onViewChange(view)}
                className={`
                    flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors
                    ${isActive
                        ? 'bg-cyan-500/10 text-cyan-300'
                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                    }
                `}
            >
                <Icon className="w-6 h-6 mr-4" />
                <span className="font-semibold">{label}</span>
            </button>
        );
    }

    return (
        <aside className="w-64 bg-gray-900/70 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
            <header className="flex items-center gap-3 px-2 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h4M8 7a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2h-4a2 2 0 01-2-2l-4.5-4.5L8 7z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-white">AI Archivist</h1>
            </header>

            <nav className="flex-grow space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.id}
                        view={item.id as View}
                        label={item.label}
                        Icon={item.Icon}
                    />
                ))}
            </nav>

            <footer className="mt-auto text-center text-xs text-gray-500">
                <p>Version 0.1.0-beta</p>
                <p>&copy; 2024 AI Archivist</p>
            </footer>
        </aside>
    );
};

export default Sidebar;
