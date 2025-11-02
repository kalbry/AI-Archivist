import React from 'react';

interface ToggleSwitchProps {
    label: string;
    description?: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, description, enabled, onChange, Icon }) => {
    return (
        <div className="flex items-start justify-between bg-gray-700/50 p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-start gap-4">
                 {Icon && <Icon className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0" />}
                <div>
                    <p className="font-semibold text-gray-200">{label}</p>
                    {description && <p className="text-sm text-gray-400">{description}</p>}
                </div>
            </div>
            <button
                type="button"
                className={`${
                    enabled ? 'bg-cyan-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 ml-4 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                role="switch"
                aria-checked={enabled}
                onClick={() => onChange(!enabled)}
            >
                <span
                    aria-hidden="true"
                    className={`${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
    );
};

export default ToggleSwitch;
