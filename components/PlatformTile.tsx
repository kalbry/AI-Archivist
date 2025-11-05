import React from 'react';
import { Platform, PlatformStatus } from '@/types';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, XCircleIcon, SpinnerIcon, PLATFORM_LOGOS } from './Icons';
import { Card, CardContent } from './ui/Card';
import { cn } from '@/lib/utils';

interface PlatformTileProps {
    platform: Platform;
    isSelected: boolean;
    onSelect: () => void;
}

const statusConfig = {
    [PlatformStatus.Ready]: {
        Icon: CheckCircleIcon,
        color: 'text-green-400',
        bgColor: 'bg-green-500/5 hover:bg-green-500/10',
        borderColor: 'border-green-500/20',
        ringColor: 'ring-cyan-500/50',
    },
    [PlatformStatus.NeedsLogin]: {
        Icon: ExclamationTriangleIcon,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/5 hover:bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        ringColor: 'ring-yellow-500/50',
    },
    [PlatformStatus.Outdated]: {
        Icon: ClockIcon,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/5 hover:bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        ringColor: 'ring-orange-500/50',
    },
    [PlatformStatus.Blocked]: {
        Icon: XCircleIcon,
        color: 'text-red-400',
        bgColor: 'bg-red-500/5 hover:bg-red-500/10',
        borderColor: 'border-red-500/20',
        ringColor: 'ring-red-500/50',
    },
    [PlatformStatus.Updating]: {
        Icon: SpinnerIcon,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/5 hover:bg-cyan-500/10',
        borderColor: 'border-cyan-500/20',
        ringColor: 'ring-cyan-500/50',
    }
};

const PlatformTile: React.FC<PlatformTileProps> = ({ platform, isSelected, onSelect }) => {
    const { Icon, color, bgColor, borderColor, ringColor } = statusConfig[platform.status];
    const isDisabled = platform.status !== PlatformStatus.Ready;
    const isUpdating = platform.status === PlatformStatus.Updating;
    const logo = PLATFORM_LOGOS[platform.id];

    return (
        <Card
            onClick={!isDisabled && !isUpdating ? onSelect : undefined}
            className={cn(
                'relative transition-all duration-300 cursor-pointer group',
                bgColor,
                borderColor,
                {
                    'opacity-60 cursor-not-allowed': isDisabled || isUpdating,
                    'hover:-translate-y-1 hover:shadow-lg': !isDisabled && !isUpdating,
                    [`ring-2 ${ringColor}`]: isSelected && !isUpdating,
                }
            )}
            variant="ghost"
            hover={!isDisabled && !isUpdating}
        >
            <CardContent className="p-4">
                {isSelected && !isUpdating && (
                    <div className="absolute top-2 right-2 text-cyan-400">
                        <CheckCircleIcon className="w-6 h-6" />
                    </div>
                )}
                <div className="flex items-center mb-3">
                    <div className="w-8 h-8 mr-3 transition-transform group-hover:scale-110">{logo}</div>
                    <h3 className="font-bold text-lg text-gray-100">{platform.name}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                    {platform.conversationCount.toLocaleString()} conversations
                </p>
                <div className={cn(
                    'flex items-center text-xs px-2 py-1 rounded-full w-fit',
                    'transition-colors duration-200',
                    bgColor,
                    color
                )}>
                    <Icon className={cn(
                        'w-4 h-4 mr-1.5',
                        { 'animate-spin': isUpdating }
                    )} />
                    <span>{platform.status}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default PlatformTile;