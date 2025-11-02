import React from 'react';

const DocsView: React.FC = () => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl shadow-black/20 text-gray-300">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Documentation</h2>
                <p className="text-lg text-gray-400">Welcome to the AI Archivist documentation.</p>
            </header>

            <div className="prose prose-invert prose-lg max-w-none">
                <h3 className="text-cyan-400">Getting Started</h3>
                <p>
                    AI Archivist helps you securely back up and export your conversations from various AI chat platforms.
                    The process is simple:
                </p>
                <ol>
                    <li><strong>Dashboard:</strong> Select the platforms you wish to archive. Ensure they are in a 'Ready' state.</li>
                    <li><strong>Adapters:</strong> Keep your platform adapters up-to-date for the best compatibility. We'll notify you when updates are available.</li>
                    <li><strong>Run Archive:</strong> Click the "Start New Archive Run" button, confirm the scope, select your desired export formats, and start the process.</li>
                    <li><strong>Settings:</strong> Configure application settings, such as enabling vault encryption for your local database.</li>
                </ol>

                <h3 className="text-cyan-400 mt-8">Security</h3>
                <p>
                    Your privacy and security are paramount. AI Archivist runs locally on your machine.
                    When adapters are updated, they are pulled from a remote registry that is cryptographically signed to ensure their integrity.
                    You can verify the public key fingerprint in the Settings panel. For maximum security, you can enable Vault Encryption, which encrypts the SQLite database on your disk using SQLCipher.
                </p>

                <h3 className="text-cyan-400 mt-8">Troubleshooting</h3>
                <p>
                    If a platform shows a status like 'Needs Login' or 'Blocked', it means the automated scraper requires your intervention.
                    Running an archive on these platforms may open a browser window asking you to log in or solve a CAPTCHA.
                    Follow the on-screen instructions to proceed.
                </p>
            </div>
        </div>
    );
};

export default DocsView;
