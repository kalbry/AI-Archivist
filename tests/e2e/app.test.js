const { expect, test, beforeAll, afterAll } = require('@jest/globals');
const { _electron: electron } = require('playwright');
const path = require('path');

describe('AI Archivist E2E Tests', () => {
    let electronApp;

    beforeAll(async () => {
        // Launch Electron app
        electronApp = await electron.launch({
            args: [path.join(__dirname, '../../main.js')],
        });
    });

    afterAll(async () => {
        await electronApp.close();
    });

    test('app launches successfully', async () => {
        const window = await electronApp.firstWindow();
        const title = await window.title();
        expect(title).toBe('AI Archivist');
    });

    test('platform tiles are displayed', async () => {
        const window = await electronApp.firstWindow();
        const platforms = await window.$$('div[data-testid="platform-tile"]');
        expect(platforms.length).toBeGreaterThan(0);
    });

    test('can start archive run', async () => {
        const window = await electronApp.firstWindow();
        
        // Select a platform
        await window.click('div[data-testid="platform-tile-chatgpt"]');
        
        // Open wizard
        await window.click('button:has-text("Start New Archive Run")');
        
        // Verify wizard opened
        const wizardTitle = await window.$('text=Archive Run Wizard');
        expect(wizardTitle).toBeTruthy();
    });

    test('handles authentication flow', async () => {
        const window = await electronApp.firstWindow();
        
        // Start authentication
        await window.click('button:has-text("Login")');
        
        // Verify auth prompt
        const authPrompt = await window.$('text=Please complete authentication');
        expect(authPrompt).toBeTruthy();
    });

    test('exports conversation data', async () => {
        const window = await electronApp.firstWindow();
        
        // Select export format
        await window.click('text=Markdown (.md)');
        
        // Start export
        await window.click('button:has-text("Start Export")');
        
        // Verify export progress
        const progress = await window.$('div[role="progressbar"]');
        expect(progress).toBeTruthy();
    });
});