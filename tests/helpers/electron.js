const { _electron: electron } = require('playwright');
const path = require('path');

class ElectronTestHelper {
    static async launch(options = {}) {
        const defaultOptions = {
            args: ['--no-sandbox', '--disable-gpu'],
            env: {
                ...process.env,
                NODE_ENV: 'test',
            }
        };

        const mergedOptions = { ...defaultOptions, ...options };
        const electronApp = await electron.launch(mergedOptions);
        return electronApp;
    }

    static async setupTestEnvironment() {
        const electronApp = await this.launch({
            args: [path.join(__dirname, '../../main.js')]
        });
        const window = await electronApp.firstWindow();
        return { electronApp, window };
    }

    static async cleanup(electronApp) {
        if (electronApp) {
            await electronApp.close();
        }
    }
}

module.exports = ElectronTestHelper;