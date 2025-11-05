const { expect, test, beforeAll, afterAll } = require('@jest/globals');
const ElectronTestHelper = require('../helpers/electron');

describe('AI Archivist E2E Tests', () => {
    let electronApp;
    let window;

    beforeAll(async () => {
        const env = await ElectronTestHelper.setupTestEnvironment();
        electronApp = env.electronApp;
        window = env.window;
    });

    afterAll(async () => {
        await ElectronTestHelper.cleanup(electronApp);
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