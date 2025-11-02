import React from 'react';
import { Platform, PlatformStatus } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, XCircleIcon, SpinnerIcon, PLATFORM_LOGOS } from './Icons';

interface PlatformTileProps {
    platform: Platform;
    isSelected: boolean;
    onSelect: () => void;
}

const statusConfig = {
    [PlatformStatus.Ready]: {
        Icon: CheckCircleIcon,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        ringColor: 'ring-cyan-500',
    },
    [PlatformStatus.NeedsLogin]: {
        Icon: ExclamationTriangleIcon,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        ringColor: 'ring-yellow-500',
    },
    [PlatformStatus.Outdated]: {
        Icon: ClockIcon,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        ringColor: 'ring-orange-500',
    },
    [PlatformStatus.Blocked]: {
        Icon: XCircleIcon,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        ringColor: 'ring-red-500',
    },
    [PlatformStatus.Updating]: {
        Icon: SpinnerIcon,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/30',
        ringColor: 'ring-cyan-500',
    }
};

const PlatformTile: React.FC<PlatformTileProps> = ({ platform, isSelected, onSelect }) => {
    const { Icon, color, bgColor, borderColor, ringColor } = statusConfig[platform.status];
    const isDisabled = platform.status !== PlatformStatus.Ready;
    const isUpdating = platform.status === PlatformStatus.Updating;
    const logo = PLATFORM_LOGOS[platform.id];

    return (
        <div
            onClick={!isDisabled && !isUpdating ? onSelect : undefined}
            className={`
                relative p-4 rounded-lg border transition-all duration-300 transform
                ${bgColor} ${borderColor}
                ${isDisabled || isUpdating
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer hover:border-cyan-400/50 hover:-translate-y-1'
                }
                ${isSelected && !isUpdating
                    ? `ring-2 ${ringColor} border-transparent`
                    : ''
                }
            `}
        >
            {isSelected && !isUpdating && (
                <div className="absolute top-2 right-2 text-cyan-400">
                    <CheckCircleIcon className="w-6 h-6" />
                </div>
            )}
            <div className="flex items-center mb-3">
                <div className="w-8 h-8 mr-3">{logo}</div>
                <h3 className="font-bold text-lg text-gray-100">{platform.name}</h3>
            </div>
            <p className="text-sm text-gray-400 mb-3">{platform.conversationCount} conversations</p>
            <div className={`flex items-center text-xs px-2 py-1 rounded-full ${bgColor} ${color} w-fit`}>
                <Icon className={`w-4 h-4 mr-1.5 ${isUpdating ? 'animate-spin' : ''}`} />
                <span>{platform.status}</span>
            </div>
        </div>
    );
};

export default PlatformTile;