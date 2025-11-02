
import React from 'react';

interface ProgressBarProps {
    percent: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => {
    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
