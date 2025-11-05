import React from 'react';
import { Platform } from '@/types';
import PlatformTile from './PlatformTile';
import { Button } from './ui/Button';

interface DashboardProps {
    platforms: Platform[];
    selectedPlatforms: Set<string>;
    onTogglePlatform: (platformId: string) => void;
    onStartRun: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    platforms,
    selectedPlatforms,
    onTogglePlatform,
    onStartRun
}) => {
    const selectedCount = selectedPlatforms.size;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold">Dashboard</h2>
                    <p className="text-surface-400 mt-1">Select platforms to begin an archive run.</p>
                </div>
                <Button
                    size="lg"
                    onClick={onStartRun}
                    disabled={selectedCount === 0}
                >
                    Start New Archive Run ({selectedCount})
                </Button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {platforms.map(platform => (
                    <PlatformTile
                        key={platform.id}
                        platform={platform}
                        isSelected={selectedPlatforms.has(platform.id)}
                        onSelect={() => onTogglePlatform(platform.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;