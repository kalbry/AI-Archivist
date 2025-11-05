import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import { Settings } from '@/types';
import { LockClosedIcon } from './Icons';

interface SettingsViewProps {
    settings: Settings;
    onSettingsChange: (newSettings: Settings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSettingsChange }) => {

    const handleToggle = (key: keyof Settings) => {
        onSettingsChange({ ...settings, [key]: !settings[key] });
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-2xl shadow-black/20">
            <header className="mb-8">
                <h2 className="text-2xl font-semibold mb-1">Application Settings</h2>
                <p className="text-gray-400">Configure security, privacy, and behavior for AI Archivist.</p>
            </header>

            <div className="space-y-6">
                {/* Data & Storage Section */}
                <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2 border-b border-gray-700 pb-2">Data & Storage</h3>
                    <div className="mt-4 space-y-4">
                        <ToggleSwitch
                            Icon={LockClosedIcon}
                            label="Vault Encryption (SQLCipher)"
                            description="Encrypt your local database file for enhanced security. Requires restart."
                            enabled={settings.vaultEncryption}
                            onChange={() => handleToggle('vaultEncryption')}
                        />
                    </div>
                </div>

                {/* Privacy & Telemetry Section */}
                <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2 border-b border-gray-700 pb-2">Privacy & Telemetry</h3>
                     <div className="mt-4 space-y-4">
                        <ToggleSwitch
                            label="Anonymous Telemetry"
                            description="Help improve AI Archivist by sending anonymous success/failure events."
                            enabled={settings.telemetry}
                            onChange={() => handleToggle('telemetry')}
                        />
                    </div>
                </div>
                 {/* Remote Configuration Section */}
                <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2 border-b border-gray-700 pb-2">Remote Configuration</h3>
                    <div className="mt-4 bg-gray-900/50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-200">Selector Registry Public Key</p>
                        <p className="text-sm text-gray-400 mb-2">The fingerprint of the key used to verify adapter updates.</p>
                        <code className="text-xs text-green-400 bg-gray-800 p-2 rounded-md block break-all">ed25519:12aBcdE34fGhIjK56lMnOpQ78rStUvW90xYzAbC12dE</code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;